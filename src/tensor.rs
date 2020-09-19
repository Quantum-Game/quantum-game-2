use crate::complex::Complex;
use crate::util::{DebugHlist, HlistPrint, MapExt as _};
use frunk::hlist::{HList, HZippable, Sculptor};
use std::{
    collections::HashMap,
    fmt,
    fmt::Debug,
    hash::Hash,
    iter::{once, FromIterator},
    ops::{Add, AddAssign, Mul, MulAssign, Sub, SubAssign},
};

pub trait Dims: HList + Eq + Hash + Clone + Copy + Debug {}
impl<T: HList + Eq + Hash + Clone + Copy + Debug> Dims for T {}

pub struct Tensor<D> {
    values: HashMap<D, Complex>,
}

impl<D> fmt::Debug for Tensor<D>
where
    D: DebugHlist,
{
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        struct DebugTensorMap<'a, D>(&'a HashMap<D, Complex>);
        impl<'a, D> fmt::Debug for DebugTensorMap<'a, D>
        where
            D: DebugHlist,
        {
            fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
                f.debug_map()
                    .entries(self.0.iter().map(|(k, v)| (HlistPrint(k), v)))
                    .finish()
            }
        }

        f.debug_tuple("Tensor")
            .field(&DebugTensorMap(&self.values))
            .finish()
    }
}

impl<D> PartialEq for Tensor<D>
where
    HashMap<D, Complex>: PartialEq,
{
    fn eq(&self, other: &Self) -> bool {
        self.values.eq(&other.values)
    }
}

impl<D> Default for Tensor<D> {
    fn default() -> Self {
        Self::new()
    }
}

impl<D> Tensor<D> {
    /// Create tensor full of zeros.
    pub fn new() -> Self {
        Tensor {
            values: HashMap::new(),
        }
    }
}

impl<D: Dims> Tensor<D> {
    pub fn scalar(z: Complex) -> Tensor<Hlist![]> {
        Tensor::from_values(once((hlist![], z)))
    }

    pub fn from_values(values: impl IntoIterator<Item = (D, Complex)>) -> Self {
        Tensor {
            values: values
                .into_iter()
                .filter(|(_, v)| !v.almost_zero())
                .collect(),
        }
    }

    pub fn values(&self) -> &HashMap<D, Complex> {
        &self.values
    }

    pub fn insert(&mut self, key: D, value: Complex) {
        if !value.almost_zero() {
            self.values.insert(key, value);
        }
    }

    pub fn dot(&self, rhs: &Self) -> Complex {
        self.values
            .iter_both(&rhs.values)
            .map(|(_, v1, v2)| v1 * v2)
            .sum()
    }

    pub fn norm_squared(&self) -> f32 {
        self.values.values().map(Complex::abs2).sum()
    }

    pub fn norm(&self) -> f32 {
        self.norm_squared().sqrt()
    }

    pub fn group_by_dims<E: Dims, Indices>(&self) -> HashMap<D::Remainder, Tensor<E>>
    where
        D: Sculptor<E, Indices>,
        D::Remainder: Dims,
    {
        let mut map: HashMap<D::Remainder, Tensor<E>> = HashMap::new();
        for (&k, &v) in &self.values {
            let (selected, key) = Sculptor::sculpt(k);
            map.entry(key)
                .and_modify(|t| t.insert(selected, v))
                .or_insert_with(|| Tensor::from_values(once((selected, v))));
        }
        map
    }

    pub fn dot_partial<E: Dims, Indices>(&self, rhs: &Tensor<E>) -> Tensor<E::Remainder>
    where
        E: Sculptor<D, Indices>,
        E::Remainder: Dims,
    {
        let grouped = rhs.group_by_dims::<D, _>();
        Tensor::from_values(
            grouped
                .into_iter()
                .map(|(coords, vector)| (coords, self.dot(&vector))),
        )
    }

    pub fn inner_partial<E: Dims, Indices>(&self, rhs: &Tensor<E>) -> Tensor<E::Remainder>
    where
        E: Sculptor<D, Indices>,
        E::Remainder: Dims,
    {
        self.conj().dot_partial(rhs)
    }

    #[inline]
    pub fn map_values(&self, f: impl FnMut(&Complex) -> Complex) -> Self {
        Self {
            values: self.values.map_values(f).collect(),
        }
    }

    /// ```compile_fail
    /// use frunk::Hlist;
    /// use quanta::Tensor;
    /// let t: Tensor<Hlist![u8, u16]> = Tensor::zeros();
    /// let impossible_permute: Tensor<Hlist![u8]> = t.permute(); // should not compile
    /// ```
    pub fn permute<E: Dims, Indices>(&self) -> Tensor<E>
    where
        // HZippable used for hlist length equality
        D: Sculptor<E, Indices> + HZippable<E>,
    {
        Tensor {
            values: self
                .values
                .iter()
                .map::<(E, Complex), _>(|(k, v)| (Sculptor::sculpt(*k).0, *v))
                .collect(),
        }
    }

    pub fn conj(&self) -> Self {
        self.map_values(Complex::conj)
    }

    pub fn outer<E: Dims>(&self, other: &Tensor<E>) -> Tensor<<D as Add<E>>::Output>
    where
        D: Add<E>,
        <D as Add<E>>::Output: Dims,
    {
        let a = &self.values;
        let b = &other.values;
        Tensor {
            values: a
                .iter()
                .flat_map(|(&k1, &v1)| b.iter().map(move |(&k2, &v2)| (k1 + k2, v1 * v2)))
                .collect(),
        }
    }
}

impl<D: Dims> FromIterator<(D, Complex)> for Tensor<D> {
    fn from_iter<T: IntoIterator<Item = (D, Complex)>>(iter: T) -> Self {
        Tensor::from_values(iter)
    }
}

impl<D: Dims> AddAssign<&Tensor<D>> for Tensor<D> {
    fn add_assign(&mut self, rhs: &Tensor<D>) {
        self.values.retain(|key, value| {
            if let Some(value2) = rhs.values.get(key) {
                *value += *value2;
                !value.almost_zero()
            } else {
                true
            }
        })
    }
}

impl<D: Dims> Add<&Tensor<D>> for &Tensor<D> {
    type Output = Tensor<D>;
    fn add(self, rhs: &Tensor<D>) -> Self::Output {
        Tensor {
            values: self
                .values
                .iter_either(&rhs.values)
                .filter_map(|(k, v1, v2)| match (v1, v2) {
                    (None, None) => None,
                    (Some(v), None) | (None, Some(v)) => Some((*k, *v)),
                    (Some(v1), Some(v2)) => Some((*k, *v1 + *v2)).filter(|(_, v)| !v.almost_zero()),
                })
                .collect(),
        }
    }
}

impl<D: Dims> SubAssign<&Tensor<D>> for Tensor<D> {
    fn sub_assign(&mut self, rhs: &Tensor<D>) {
        self.values.retain(|key, value| {
            if let Some(value2) = rhs.values.get(key) {
                *value -= *value2;
                !value.almost_zero()
            } else {
                true
            }
        })
    }
}

impl<D: Dims> Sub<&Tensor<D>> for &Tensor<D> {
    type Output = Tensor<D>;
    fn sub(self, rhs: &Tensor<D>) -> Self::Output {
        Tensor {
            values: self
                .values
                .iter_either(&rhs.values)
                .filter_map(|(k, v1, v2)| match (v1, v2) {
                    (None, None) => None,
                    (Some(v), None) => Some((*k, *v)),
                    (None, Some(v)) => Some((*k, -v)),
                    (Some(v1), Some(v2)) => Some((*k, *v1 - *v2)).filter(|(_, v)| !v.almost_zero()),
                })
                .collect(),
        }
    }
}
impl<D: Dims> Mul<Complex> for &Tensor<D> {
    type Output = Tensor<D>;
    fn mul(self, rhs: Complex) -> Self::Output {
        self.values.map_values(|&v| v * rhs).collect()
    }
}

impl<D: Dims> MulAssign<Complex> for Tensor<D> {
    fn mul_assign(&mut self, rhs: Complex) {
        self.values.retain(|_, value| {
            *value *= rhs;
            !value.almost_zero()
        })
    }
}

#[cfg(test)]
mod tests {
    use crate::{cx, tensor, Polarization, PositionX, Spin, Tensor};

    const U_0: Hlist![Spin, PositionX] = hlist![Spin::U, PositionX(0)];
    const D_0: Hlist![Spin, PositionX] = hlist![Spin::D, PositionX(0)];
    const U_1: Hlist![Spin, PositionX] = hlist![Spin::U, PositionX(1)];
    const D_1: Hlist![Spin, PositionX] = hlist![Spin::D, PositionX(1)];
    const D_H: Hlist![Spin, Polarization] = hlist![Spin::D, Polarization::H];
    const U_H: Hlist![Spin, Polarization] = hlist![Spin::U, Polarization::H];
    const D_V: Hlist![Spin, Polarization] = hlist![Spin::D, Polarization::V];

    fn vector() -> Tensor<Hlist![Spin, PositionX]> {
        tensor![
            U_0 => cx(1.0, -1.0),
            D_0 => cx(2.0, -2.0),
            U_1 => cx(3.0, -3.0),
            D_1 => cx(0.0, 0.0),
        ]
    }

    fn vector2() -> Tensor<Hlist![Spin, PositionX]> {
        tensor![
            U_0 => cx(0.0, 0.0),
            D_0 => cx(-2.0, 1.0),
            U_1 => cx(0.0, 0.5),
            D_1 => cx(0.0, 0.0),
        ]
    }

    #[test]
    fn should_compute_the_dot_product_of_two_tensors() {
        let t = vector();
        let t2 = vector2();
        assert_eq!(t.dot(&t), cx(0.0, -28.0));
        assert_eq!(t.dot(&t2), cx(-0.5, 7.5));
    }

    #[test]
    fn should_map_values() {
        let t = tensor![
            D_H => cx(0.0, 2.0),
            U_H => cx(-1.0, -1.0),
            D_V => cx(0.5, 2.5),
        ];
        let t2 = tensor![
            D_H => cx(4.0, 0.0),
            U_H => cx(2.0, 0.0),
            D_V => cx(6.5, 0.0),
        ];
        assert_eq!(t.map_values(|z| *z * z.conj()), t2);
    }

    #[test]
    fn should_substract_a_vector_from_another_one() {
        let t = vector();
        let t2 = vector2();
        let sub = tensor![
            U_0 => cx(1.0, -1.0),
            D_0 => cx(4.0, -3.0),
            U_1 => cx(3.0, -3.5),
            D_1 => cx(0.0, 0.0),
        ];

        assert_eq!(&t - &t, Tensor::new());
        assert_eq!(&t - &t2, sub);
    }

    #[test]
    fn should_permute_a_vector() {
        let reverse: Tensor<Hlist![PositionX, Spin]> = vector().permute();
        let expected = tensor![
            hlist![PositionX(0), Spin::U] => cx(1.0, -1.0),
            hlist![PositionX(0), Spin::D] => cx(2.0, -2.0),
            hlist![PositionX(1), Spin::U] => cx(3.0, -3.0),
            hlist![PositionX(1), Spin::D] => cx(0.0, 0.0),
        ];

        assert_eq!(reverse, expected);
    }

    #[test]
    fn should_compute_the_outer_product_of_two_vectors() {
        use PositionX as P;
        use Spin::{D, U};

        let v1 = tensor![
            U_0 => cx(0.0, 0.0),
            D_0 => cx(1.0, 0.0),
            U_1 => cx(2.0, 0.0),
            D_1 => cx(3.0, 0.0),
        ];
        let v2 = tensor![
            U_0 => cx(1.0, 0.0),
            D_0 => cx(0.0, 1.0),
            U_1 => cx(-1.0, 0.0),
            D_1 => cx(0.0, -1.0),
        ];
        let outer = tensor![
            hlist![U, P(0), U, P(0)] => cx(0.0, 0.0),
            hlist![U, P(0), D, P(0)] => cx(0.0, 0.0),
            hlist![U, P(0), U, P(1)] => cx(0.0, 0.0),
            hlist![U, P(0), D, P(1)] => cx(0.0, 0.0),
            hlist![D, P(0), U, P(0)] => cx(1.0, 0.0),
            hlist![D, P(0), D, P(0)] => cx(0.0, 1.0),
            hlist![D, P(0), U, P(1)] => cx(-1.0, 0.0),
            hlist![D, P(0), D, P(1)] => cx(0.0, -1.0),
            hlist![U, P(1), U, P(0)] => cx(2.0, 0.0),
            hlist![U, P(1), D, P(0)] => cx(0.0, 2.0),
            hlist![U, P(1), U, P(1)] => cx(-2.0, 0.0),
            hlist![U, P(1), D, P(1)] => cx(0.0, -2.0),
            hlist![D, P(1), U, P(0)] => cx(3.0, 0.0),
            hlist![D, P(1), D, P(0)] => cx(0.0, 3.0),
            hlist![D, P(1), U, P(1)] => cx(-3.0, 0.0),
            hlist![D, P(1), D, P(1)] => cx(0.0, -3.0),
        ];
        assert_eq!(v1.outer(&v2), outer);
    }

    #[test]
    fn should_group_by_dims() {
        let t = tensor![
            hlist![Spin::D, Polarization::H, PositionX(0)] => cx(1.0, 0.0),
            hlist![Spin::D, Polarization::V, PositionX(1)] => cx(-1.0, 0.0),
            hlist![Spin::D, Polarization::V, PositionX(2)] => cx(0.0, 1.0),
        ];

        let group_pos = t.group_by_dims::<Hlist![PositionX], _>();
        assert_eq!(group_pos.len(), 2);
        assert_eq!(
            group_pos.get(&hlist![Spin::D, Polarization::H]),
            Some(&tensor![hlist![PositionX(0)] => cx(1.0, 0.0)])
        );
        assert_eq!(
            group_pos.get(&hlist![Spin::D, Polarization::V]),
            Some(&tensor![
                hlist![PositionX(1)] => cx(-1.0, 0.0),
                hlist![PositionX(2)] => cx(0.0, 1.0),
            ])
        );

        let group_other = t.group_by_dims::<Hlist![Spin, Polarization], _>();
        assert_eq!(group_other.len(), 3);
        assert_eq!(
            group_other.get(&hlist![PositionX(0)]),
            Some(&tensor![D_H => cx(1.0, 0.0)])
        );
        assert_eq!(
            group_other.get(&hlist![PositionX(1)]),
            Some(&tensor![D_V => cx(-1.0, 0.0)])
        );
        assert_eq!(
            group_other.get(&hlist![PositionX(2)]),
            Some(&tensor![D_V => cx(0.0, 1.0)])
        );
    }

    #[test]
    fn should_compute_partial_dot_and_inner() {
        let main = tensor![
            hlist![Spin::D, Polarization::H, PositionX(0)] => cx(1.0, 0.0),
            hlist![Spin::D, Polarization::V, PositionX(1)] => cx(-1.0, 0.0),
            hlist![Spin::D, Polarization::V, PositionX(2)] => cx(0.0, 1.0),
        ];

        let small = tensor![
            hlist![PositionX(0)] => cx(10.0, 0.0),
            hlist![PositionX(2)] => cx(0.0, 3.0),
        ];
        let res1 = tensor![
            D_H => cx(10.0, 0.0),
            D_V => cx(-3.0, 0.0),
        ];

        assert_eq!(small.dot_partial(&main), res1);

        let small2 = tensor![hlist![Polarization::H] => cx(0.0, 1.0)];
        let res2inner = tensor![hlist![Spin::D, PositionX(0)] => cx(0.0, -1.0)];

        assert_eq!(small2.inner_partial(&main), res2inner);

        let small3 = tensor![hlist![Spin::U] => cx(0.0, 1.0)];

        assert_eq!(small3.inner_partial(&main).norm_squared(), 0.0);

        let small4 = tensor![
            hlist![Spin::D, PositionX(1)] => cx(0.0, 1.0),
            hlist![Spin::D, PositionX(2)] => cx(0.0, 1.0),
        ];

        let res4inner = tensor![hlist![Polarization::V] => cx(1.0, 1.0)];

        assert_eq!(small4.inner_partial(&main), res4inner);
    }
}
