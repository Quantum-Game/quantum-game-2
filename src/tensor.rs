use crate::complex::Complex;
use crate::util::MapExt as _;
use frunk::hlist::{HList, HZippable, Sculptor};
use std::{
    collections::HashMap,
    fmt::Debug,
    hash::Hash,
    iter::{once, FromIterator},
    ops::{Add, AddAssign, Mul, MulAssign, Sub, SubAssign},
};

pub trait Dims: HList + Eq + Hash + Clone + Copy + Debug {}
impl<T: HList + Eq + Hash + Clone + Copy + Debug> Dims for T {}

#[derive(PartialEq, Debug, Default)]
pub struct Tensor<D: Dims> {
    values: HashMap<D, Complex>,
}

impl<D: Dims> Tensor<D> {
    pub fn zeros() -> Self {
        Tensor {
            values: Default::default(),
        }
    }

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
        Tensor {
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
impl<'a, 'b, D: Dims> Mul<Complex> for &'b Tensor<D> {
    type Output = Tensor<D>;
    fn mul(self, rhs: Complex) -> Self::Output {
        Tensor {
            values: self.values.iter().map(|(k, v)| (*k, *v * rhs)).collect(),
        }
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

// #[derive(Clone, Copy, Eq, PartialEq, Hash)]
// enum Direction {
//     Right,
//     Up,
//     Left,
//     Bottom,
// }

// #[derive(Clone, Copy, Eq, PartialEq, Hash)]
// struct Position2(u32, u32);

#[cfg(test)]
mod tests {
    use super::*;
    // use approx::ulps_eq;
    // use std::f32::consts::PI;

    #[derive(Debug, Clone, Copy, Eq, PartialEq, Hash)]
    enum Polarization {
        H,
        V,
    }

    #[derive(Debug, Clone, Copy, Eq, PartialEq, Hash)]
    enum Spin {
        U,
        D,
    }

    #[derive(Debug, Clone, Copy, Eq, PartialEq, Hash)]
    struct Position(u32);

    fn vector() -> Tensor<Hlist![Spin, Position]> {
        Tensor::from_values(vec![
            (hlist![Spin::U, Position(0)], Complex::new(1.0, -1.0)),
            (hlist![Spin::D, Position(0)], Complex::new(2.0, -2.0)),
            (hlist![Spin::U, Position(1)], Complex::new(3.0, -3.0)),
            (hlist![Spin::D, Position(1)], Complex::new(0.0, 0.0)),
        ])
    }

    fn vector2() -> Tensor<Hlist![Spin, Position]> {
        Tensor::from_values(vec![
            (hlist![Spin::U, Position(0)], Complex::new(0.0, 0.0)),
            (hlist![Spin::D, Position(0)], Complex::new(-2.0, 1.0)),
            (hlist![Spin::U, Position(1)], Complex::new(0.0, 0.5)),
            (hlist![Spin::D, Position(1)], Complex::new(0.0, 0.0)),
        ])
    }

    #[test]
    fn should_compute_the_dot_product_of_two_tensors() {
        let t = vector();
        let t2 = vector2();
        assert_eq!(t.dot(&t), Complex::new(0.0, -28.0));
        assert_eq!(t.dot(&t2), Complex::new(-0.5, 7.5));
    }

    #[test]
    fn should_map_values() {
        let t = Tensor::from_values(vec![
            (hlist![Spin::D, Polarization::H], Complex::new(0.0, 2.0)),
            (hlist![Spin::U, Polarization::H], Complex::new(-1.0, -1.0)),
            (hlist![Spin::D, Polarization::V], Complex::new(0.5, 2.5)),
        ]);
        let t2 = Tensor::from_values(vec![
            (hlist![Spin::D, Polarization::H], Complex::new(4.0, 0.0)),
            (hlist![Spin::U, Polarization::H], Complex::new(2.0, 0.0)),
            (hlist![Spin::D, Polarization::V], Complex::new(6.5, 0.0)),
        ]);
        assert_eq!(t.map_values(|z| *z * z.conj()), t2);
    }

    #[test]
    fn should_substract_a_vector_from_another_one() {
        let t = vector();
        let t2 = vector2();
        let sub = Tensor::from_values(vec![
            (hlist![Spin::U, Position(0)], Complex::new(1.0, -1.0)),
            (hlist![Spin::D, Position(0)], Complex::new(4.0, -3.0)),
            (hlist![Spin::U, Position(1)], Complex::new(3.0, -3.5)),
            (hlist![Spin::D, Position(1)], Complex::new(0.0, 0.0)),
        ]);

        assert_eq!(&t - &t, Tensor::zeros());
        assert_eq!(&t - &t2, sub);
    }

    #[test]
    fn should_permute_a_vector() {
        let reverse: Tensor<Hlist![Position, Spin]> = vector().permute();
        let expected = Tensor::from_values(vec![
            (hlist![Position(0), Spin::U], Complex::new(1.0, -1.0)),
            (hlist![Position(0), Spin::D], Complex::new(2.0, -2.0)),
            (hlist![Position(1), Spin::U], Complex::new(3.0, -3.0)),
            (hlist![Position(1), Spin::D], Complex::new(0.0, 0.0)),
        ]);

        assert_eq!(reverse, expected);
    }

    #[test]
    fn should_compute_the_outer_product_of_two_vectors() {
        use Complex as C;
        use Position as P;
        use Spin::{D, U};
        let v1 = Tensor::from_values(vec![
            (hlist![U, P(0)], C::new(0.0, 0.0)),
            (hlist![D, P(0)], C::new(1.0, 0.0)),
            (hlist![U, P(1)], C::new(2.0, 0.0)),
            (hlist![D, P(1)], C::new(3.0, 0.0)),
        ]);
        let v2 = Tensor::from_values(vec![
            (hlist![U, P(0)], C::new(1.0, 0.0)),
            (hlist![D, P(0)], C::new(0.0, 1.0)),
            (hlist![U, P(1)], C::new(-1.0, 0.0)),
            (hlist![D, P(1)], C::new(0.0, -1.0)),
        ]);
        let outer = Tensor::from_values(vec![
            (hlist![U, P(0), U, P(0)], C::new(0.0, 0.0)),
            (hlist![U, P(0), D, P(0)], C::new(0.0, 0.0)),
            (hlist![U, P(0), U, P(1)], C::new(0.0, 0.0)),
            (hlist![U, P(0), D, P(1)], C::new(0.0, 0.0)),
            (hlist![D, P(0), U, P(0)], C::new(1.0, 0.0)),
            (hlist![D, P(0), D, P(0)], C::new(0.0, 1.0)),
            (hlist![D, P(0), U, P(1)], C::new(-1.0, 0.0)),
            (hlist![D, P(0), D, P(1)], C::new(0.0, -1.0)),
            (hlist![U, P(1), U, P(0)], C::new(2.0, 0.0)),
            (hlist![U, P(1), D, P(0)], C::new(0.0, 2.0)),
            (hlist![U, P(1), U, P(1)], C::new(-2.0, 0.0)),
            (hlist![U, P(1), D, P(1)], C::new(0.0, -2.0)),
            (hlist![D, P(1), U, P(0)], C::new(3.0, 0.0)),
            (hlist![D, P(1), D, P(0)], C::new(0.0, 3.0)),
            (hlist![D, P(1), U, P(1)], C::new(-3.0, 0.0)),
            (hlist![D, P(1), D, P(1)], C::new(0.0, -3.0)),
        ]);
        assert_eq!(v1.outer(&v2), outer);
    }

    #[test]
    fn should_group_by_dims() {
        let t = Tensor::from_values(vec![
            (
                hlist![Spin::D, Polarization::H, Position(0)],
                Complex::new(1.0, 0.0),
            ),
            (
                hlist![Spin::D, Polarization::V, Position(1)],
                Complex::new(-1.0, 0.0),
            ),
            (
                hlist![Spin::D, Polarization::V, Position(2)],
                Complex::new(0.0, 1.0),
            ),
        ]);

        let group_pos = t.group_by_dims::<Hlist![Position], _>();
        assert_eq!(group_pos.len(), 2);
        assert_eq!(
            group_pos.get(&hlist![Spin::D, Polarization::H]),
            Some(&Tensor::from_values(vec![(
                hlist![Position(0)],
                Complex::new(1.0, 0.0)
            )]))
        );
        assert_eq!(
            group_pos.get(&hlist![Spin::D, Polarization::V]),
            Some(&Tensor::from_values(vec![
                (hlist![Position(1)], Complex::new(-1.0, 0.0)),
                (hlist![Position(2)], Complex::new(0.0, 1.0))
            ]))
        );

        let group_other = t.group_by_dims::<Hlist![Spin, Polarization], _>();
        assert_eq!(group_other.len(), 3);
        assert_eq!(
            group_other.get(&hlist![Position(0)]),
            Some(&Tensor::from_values(vec![(
                hlist![Spin::D, Polarization::H],
                Complex::new(1.0, 0.0)
            )]))
        );
        assert_eq!(
            group_other.get(&hlist![Position(1)]),
            Some(&Tensor::from_values(vec![(
                hlist![Spin::D, Polarization::V],
                Complex::new(-1.0, 0.0)
            )]))
        );
        assert_eq!(
            group_other.get(&hlist![Position(2)]),
            Some(&Tensor::from_values(vec![(
                hlist![Spin::D, Polarization::V],
                Complex::new(0.0, 1.0)
            )]))
        );
    }

    #[test]
    fn should_compute_partial_dot_and_inner() {
        let main = Tensor::from_values(vec![
            (
                hlist![Spin::D, Polarization::H, Position(0)],
                Complex::new(1.0, 0.0),
            ),
            (
                hlist![Spin::D, Polarization::V, Position(1)],
                Complex::new(-1.0, 0.0),
            ),
            (
                hlist![Spin::D, Polarization::V, Position(2)],
                Complex::new(0.0, 1.0),
            ),
        ]);

        let small = Tensor::from_values(vec![
            (hlist![Position(0)], Complex::new(10.0, 0.0)),
            (hlist![Position(2)], Complex::new(0.0, 3.0)),
        ]);
        let res1 = Tensor::from_values(vec![
            (hlist![Spin::D, Polarization::H], Complex::new(10.0, 0.0)),
            (hlist![Spin::D, Polarization::V], Complex::new(-3.0, 0.0)),
        ]);

        assert_eq!(small.dot_partial(&main), res1);

        let small2 = Tensor::from_values(vec![(hlist![Polarization::H], Complex::new(0.0, 1.0))]);
        let res2inner = Tensor::from_values(vec![(
            hlist![Spin::D, Position(0)],
            Complex::new(0.0, -1.0),
        )]);

        assert_eq!(small2.inner_partial(&main), res2inner);

        let small3 = Tensor::from_values(vec![(hlist![Spin::U], Complex::new(0.0, 1.0))]);

        assert_eq!(small3.inner_partial(&main).norm_squared(), 0.0);

        let small4 = Tensor::from_values(vec![
            (hlist![Spin::D, Position(1)], Complex::new(0.0, 1.0)),
            (hlist![Spin::D, Position(2)], Complex::new(0.0, 1.0)),
        ]);

        let res4inner =
            Tensor::from_values(vec![(hlist![Polarization::V], Complex::new(1.0, 1.0))]);

        assert_eq!(small4.inner_partial(&main), res4inner);
    }
}
