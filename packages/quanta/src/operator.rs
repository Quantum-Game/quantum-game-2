use crate::{
    operator,
    util::{DebugHlist, HlistPrint, Joiner, MapExt},
    vector::DimsSculptor,
    Complex, Dims, Enumerable, Vector,
};
use alloc::boxed::Box;
use core::{
    fmt,
    iter::{once, FromIterator},
    marker::PhantomData,
    ops::{Add, AddAssign, Mul, MulAssign, Sub, SubAssign},
};
use frunk::hlist::Sculptor;
use hashbrown::hash_map::HashMap;

pub trait PartialDims<I, O, Indices>: Sized + DimsSculptor<I, Indices> {
    fn join(rest: Self::Rest, out: O) -> Self;
}

impl<I, O, Indices, T> PartialDims<I, O, Indices> for T
where
    T: Sized + DimsSculptor<I, Indices>,
    T::Rest: Joiner<O, Indices, Joined = T> + Dims,
{
    fn join(rest: Self::Rest, out: O) -> Self {
        rest.join(out)
    }
}

#[derive(Clone)]
pub struct Operator<I, O = I> {
    values: HashMap<(I, O), Complex>,
}

struct ConcretePartialOperator<I, O, E, Indices> {
    inner: Operator<I, O>,
    marker: PhantomData<(E, Indices)>,
}

pub trait PartialOperator<T: Dims> {
    fn mul_vec_partial(&self, rhs: &Vector<T>) -> Vector<T>;
}

impl<I, O, E: Dims, Indices> PartialOperator<E> for ConcretePartialOperator<I, O, E, Indices>
where
    I: Dims,
    O: Dims,
    E: Sculptor<I, Indices>,
    E::Remainder: Joiner<O, Indices, Joined = E> + Dims,
{
    fn mul_vec_partial(&self, rhs: &Vector<E>) -> Vector<E> {
        self.inner.mul_vec_partial(rhs)
    }
}

impl<I, O> Default for Operator<I, O> {
    fn default() -> Self {
        Self::new()
    }
}

impl<I, O> fmt::Debug for Operator<I, O>
where
    I: DebugHlist,
    O: DebugHlist,
{
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        struct DebugOperatorMap<'a, I, O>(&'a HashMap<(I, O), Complex>);
        impl<'a, I, O> fmt::Debug for DebugOperatorMap<'a, I, O>
        where
            I: DebugHlist,
            O: DebugHlist,
        {
            fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
                f.debug_map()
                    .entries(
                        self.0
                            .iter()
                            .map(|((a, b), v)| ((HlistPrint(a), HlistPrint(b)), v)),
                    )
                    .finish()
            }
        }

        f.debug_tuple("Operator")
            .field(&DebugOperatorMap(&self.values))
            .finish()
    }
}

impl<I, O> PartialEq for Operator<I, O>
where
    HashMap<(I, O), Complex>: PartialEq,
{
    fn eq(&self, other: &Self) -> bool {
        self.values.eq(&other.values)
    }
}

impl<D> Operator<D, D> {
    /// An operator with specified keys across diagonal being set to desired value.
    ///
    /// When all possible values are specified, it's an identity operator.
    pub fn diagonal(keys: impl IntoIterator<Item = D>, cx: Complex) -> Self
    where
        D: Dims,
    {
        Operator {
            values: keys.into_iter().map(|k| ((k.clone(), k), cx)).collect(),
        }
    }

    /// Operator with ones across whole diagonal
    pub fn identity() -> Self
    where
        D: Dims + Enumerable,
        D::Iter: Iterator<Item = D>,
    {
        Self::diagonal(D::enumerate(), Complex::ONE)
    }

    /// Operator with specified value across whole diagonal
    pub fn uniform_scale(cx: Complex) -> Self
    where
        D: Dims + Enumerable,
        D::Iter: Iterator<Item = D>,
    {
        Self::diagonal(D::enumerate(), cx)
    }

    #[inline]
    pub fn indicator(coord: D) -> Self
    where
        D: Dims,
    {
        operator![(coord.clone(), coord) => Complex::ONE]
    }
}

impl<I, O> Operator<I, O> {
    /// Create operator full of zeros.
    pub fn new() -> Self {
        Self {
            values: HashMap::new(),
        }
    }
}

impl<I: Dims, O: Dims> Operator<I, O> {
    pub fn from_values_grouped(values: impl IntoIterator<Item = ((I, O), Complex)>) -> Self {
        Operator {
            values: values
                .into_iter()
                .filter(|(_, v)| !v.almost_zero())
                .collect(),
        }
    }

    #[inline]
    pub fn map_values(&self, f: impl FnMut(&Complex) -> Complex) -> Self {
        Self {
            values: self.values.map_values(f).collect(),
        }
    }

    pub fn insert(&mut self, key: (I, O), value: Complex) {
        if !value.almost_zero() {
            self.values.insert(key, value);
        }
    }

    pub fn from_values(values: impl IntoIterator<Item = (I, O, Complex)>) -> Self {
        Self::from_values_grouped(values.into_iter().map(|(i, o, v)| ((i, o), v)))
    }

    // to row vectors
    pub fn vector_per_input(&self) -> HashMap<I, Vector<O>> {
        let mut map: HashMap<I, Vector<O>> = HashMap::new();
        for ((ref i, ref o), &v) in &self.values {
            map.raw_entry_mut()
                .from_key(i)
                .and_modify(|_, t| t.insert(o.clone(), v))
                .or_insert_with(|| (i.clone(), Vector::from_values(once((o.clone(), v)))));
        }
        map
    }

    // to column vectors
    pub fn vector_per_output(&self) -> HashMap<O, Vector<I>> {
        let mut map: HashMap<O, Vector<I>> = HashMap::new();
        for ((ref i, ref o), &v) in &self.values {
            map.raw_entry_mut()
                .from_key(o)
                .and_modify(|_, t| t.insert(i.clone(), v))
                .or_insert_with(|| (o.clone(), Vector::from_values(once((i.clone(), v)))));
        }
        map
    }

    pub fn mul_vec(&self, rhs: &Vector<I>) -> Vector<O>
    where
        HashMap<O, Vector<I>>: fmt::Debug,
    {
        self.vector_per_output()
            .map_values(|row| row.dot(rhs))
            .collect()
    }

    pub fn into_dyn<E: Dims, Indices>(self) -> Box<dyn PartialOperator<E>>
    where
        I: 'static,
        O: 'static,
        E: 'static,
        Indices: 'static,
        E: Sculptor<I, Indices>,
        E::Remainder: Joiner<O, Indices, Joined = E> + Dims,
    {
        Box::new(ConcretePartialOperator {
            inner: self,
            marker: PhantomData,
        })
    }

    pub fn mul_vec_partial<E: PartialDims<I, O, Indices>, Indices>(
        &self,
        rhs: &Vector<E>,
    ) -> Vector<E> {
        let per_output = self.vector_per_output();
        let grouped = rhs.group_by_dims::<I, Indices>();
        let entries = grouped.into_iter().flat_map(|(r, vector)| {
            per_output
                .iter()
                .map(move |(o, row)| (E::join(r.clone(), o.clone()), row.dot(&vector)))
        });
        let out = Vector::from_values(entries);
        out
    }

    // pub fn contract_left<E: Dims, Indices>(&self, rhs: Vector<E>) -> Operator<I, E> {}

    pub fn transpose(&self) -> Operator<O, I> {
        Operator {
            values: self
                .values
                .iter()
                .map(|((i, o), v)| ((o.clone(), i.clone()), *v))
                .collect(),
        }
    }

    /// Conjugate transpose (Hermitian transpose, dagger operator).
    /// https://en.wikipedia.org/wiki/Conjugate_transpose
    /// returns a^† Hermitian conjugate of an operator.
    pub fn dag(&self) -> Operator<O, I> {
        Operator {
            values: self
                .values
                .iter()
                .map(|((i, o), v)| ((o.clone(), i.clone()), v.conj()))
                .collect(),
        }
    }

    /// Elementwise complex conjugation (no transpose!).
    /// https://en.wikipedia.org/wiki/Complex_conjugate
    /// returns A^* - simple conjugate of an operator.
    pub fn conj(&self) -> Operator<I, O> {
        Operator {
            values: self.values.map_values(Complex::conj).collect(),
        }
    }

    pub fn outer<I2: Dims, O2: Dims>(
        &self,
        other: &Operator<I2, O2>,
    ) -> Operator<<I as Add<I2>>::Output, <O as Add<O2>>::Output>
    where
        O: Add<O2>,
        I: Add<I2>,
        <I as Add<I2>>::Output: Dims,
        <O as Add<O2>>::Output: Dims,
    {
        let a = &self.values;
        let b = &other.values;
        Operator {
            values: a
                .iter()
                .flat_map(|((i1, o1), v1)| {
                    b.iter().map(move |((i2, o2), v2)| {
                        ((i1.clone() + i2.clone(), o1.clone() + o2.clone()), v1 * v2)
                    })
                })
                .collect(),
        }
    }
}

impl<I: Dims, O: Dims> FromIterator<(I, O, Complex)> for Operator<I, O> {
    fn from_iter<T: IntoIterator<Item = (I, O, Complex)>>(iter: T) -> Self {
        Operator::from_values(iter)
    }
}

impl<I: Dims, O: Dims> FromIterator<((I, O), Complex)> for Operator<I, O> {
    fn from_iter<T: IntoIterator<Item = ((I, O), Complex)>>(iter: T) -> Self {
        Operator::from_values_grouped(iter)
    }
}

impl<I: Dims, O: Dims> Mul<Complex> for &Operator<I, O> {
    type Output = Operator<I, O>;
    fn mul(self, rhs: Complex) -> Self::Output {
        self.values.map_values(|&v| v * rhs).collect()
    }
}

impl<I: Dims, O: Dims> MulAssign<Complex> for Operator<I, O> {
    fn mul_assign(&mut self, rhs: Complex) {
        self.values.retain(|_, value| {
            *value *= rhs;
            !value.almost_zero()
        })
    }
}

impl<I: Dims, O: Dims> Mul<Complex> for Operator<I, O> {
    type Output = Operator<I, O>;
    fn mul(mut self, rhs: Complex) -> Self::Output {
        self *= rhs;
        self
    }
}

impl<A: Dims, B: Dims, C: Dims> Mul<&Operator<A, B>> for &Operator<B, C> {
    type Output = Operator<A, C>;
    fn mul(self, rhs: &Operator<A, B>) -> Self::Output {
        let rows = self.vector_per_output();
        let cols = rhs.vector_per_input();

        Operator {
            values: rows
                .into_iter()
                .flat_map(|(out_coords, col)| {
                    cols.iter().flat_map(move |(in_coords, row)| {
                        let dot = row.dot(&col);
                        if dot.almost_zero() {
                            return None;
                        }
                        Some(((in_coords.clone(), out_coords.clone()), dot))
                    })
                })
                .collect(),
        }
    }
}

impl<I: Dims, O: Dims> Mul<&Vector<I>> for &Operator<I, O>
where
    HashMap<O, Vector<I>>: fmt::Debug,
{
    type Output = Vector<O>;
    fn mul(self, rhs: &Vector<I>) -> Self::Output {
        self.mul_vec(rhs)
    }
}

impl<I: Dims, O: Dims> Mul<Vector<I>> for &Operator<I, O>
where
    HashMap<O, Vector<I>>: fmt::Debug,
{
    type Output = Vector<O>;
    fn mul(self, rhs: Vector<I>) -> Self::Output {
        self.mul_vec(&rhs)
    }
}

impl<I: Dims, O: Dims> Mul<Vector<I>> for Operator<I, O>
where
    HashMap<O, Vector<I>>: fmt::Debug,
{
    type Output = Vector<O>;
    fn mul(self, rhs: Vector<I>) -> Self::Output {
        self.mul_vec(&rhs)
    }
}

impl<I: Dims, O: Dims> Mul<&Vector<I>> for Operator<I, O>
where
    HashMap<O, Vector<I>>: fmt::Debug,
{
    type Output = Vector<O>;
    fn mul(self, rhs: &Vector<I>) -> Self::Output {
        self.mul_vec(&rhs)
    }
}

impl<I: Dims, O: Dims> AddAssign<&Operator<I, O>> for Operator<I, O> {
    fn add_assign(&mut self, rhs: &Operator<I, O>) {
        // add to existing values
        for (key, value) in &mut self.values {
            if let Some(value2) = rhs.values.get(key) {
                *value += *value2;
            }
        }
        // add new values
        for (k, v) in &rhs.values {
            self.values
                .raw_entry_mut()
                .from_key(k)
                .or_insert_with(|| (k.clone(), *v));
        }
        self.values.retain(|_, v| !v.almost_zero())
    }
}

impl<I: Dims, O: Dims> Add<&Operator<I, O>> for Operator<I, O> {
    type Output = Operator<I, O>;
    fn add(mut self, rhs: &Operator<I, O>) -> Self::Output {
        self += rhs;
        self
    }
}

impl<I: Dims, O: Dims> Add<Operator<I, O>> for Operator<I, O> {
    type Output = Operator<I, O>;
    fn add(mut self, rhs: Operator<I, O>) -> Self::Output {
        self += &rhs;
        self
    }
}

impl<I: Dims, O: Dims> Add<&Operator<I, O>> for &Operator<I, O> {
    type Output = Operator<I, O>;
    fn add(self, rhs: &Operator<I, O>) -> Self::Output {
        Operator {
            values: self
                .values
                .iter_either(&rhs.values)
                .filter_map(|(k, v1, v2)| match (v1, v2) {
                    (None, None) => None,
                    (Some(v), None) | (None, Some(v)) => Some((k.clone(), *v)),
                    (Some(v1), Some(v2)) => {
                        Some((k.clone(), v1 + v2)).filter(|(_, v)| !v.almost_zero())
                    }
                })
                .collect(),
        }
    }
}

impl<I: Dims, O: Dims> core::iter::Sum for Operator<I, O> {
    fn sum<T: Iterator<Item = Self>>(iter: T) -> Self {
        iter.fold(Operator::new(), Add::add)
    }
}

impl<I: Dims, O: Dims> SubAssign<&Operator<I, O>> for Operator<I, O> {
    fn sub_assign(&mut self, rhs: &Operator<I, O>) {
        // sub from existing values
        for (key, value) in &mut self.values {
            if let Some(value2) = rhs.values.get(key) {
                *value -= *value2;
            }
        }
        // sub new values
        for (k, v) in &rhs.values {
            self.values.entry(k.clone()).or_insert(-v);
        }
        self.values.retain(|_, v| !v.almost_zero())
    }
}

impl<I: Dims, O: Dims> Sub<&Operator<I, O>> for Operator<I, O> {
    type Output = Operator<I, O>;
    fn sub(mut self, rhs: &Operator<I, O>) -> Self::Output {
        self -= rhs;
        self
    }
}

impl<I: Dims, O: Dims> Sub<Operator<I, O>> for Operator<I, O> {
    type Output = Operator<I, O>;
    fn sub(self, rhs: Operator<I, O>) -> Self::Output {
        self - &rhs
    }
}

#[cfg(test)]
mod tests {
    use crate::{
        complex::cx,
        dimensions::{Polarization, PositionX, PositionY, Spin},
        map, operator, vector, Operator,
    };
    use alloc::{boxed::Box, vec, vec::Vec};
    use operator::PartialOperator;

    const D_H: Hlist![Spin, Polarization] = hlist![Spin::D, Polarization::H];
    const U_H: Hlist![Spin, Polarization] = hlist![Spin::U, Polarization::H];
    const D_V: Hlist![Spin, Polarization] = hlist![Spin::D, Polarization::V];
    const U_V: Hlist![Spin, Polarization] = hlist![Spin::U, Polarization::V];

    #[test]
    fn should_create_identity() {
        assert_eq!(
            Operator::identity(),
            operator![
                (D_H, D_H) => cx(1.0, 0.0),
                (D_V, D_V) => cx(1.0, 0.0),
                (U_H, U_H) => cx(1.0, 0.0),
                (U_V, U_V) => cx(1.0, 0.0),
            ]
        );
    }

    #[test]
    fn should_compute_complex_and_hermitian_conjugation() {
        let op = operator![
            (D_H, D_H) => cx(0.0, 2.0),
            (D_H, U_H) => cx(-1.0, -1.0),
            (D_V, U_H) => cx(0.5, 2.5),
        ];

        let op_conj = operator![
            (D_H, D_H) => cx(0.0, -2.0),
            (D_H, U_H) => cx(-1.0, 1.0),
            (D_V, U_H) => cx(0.5, -2.5),
        ];

        let op_dag = operator![
            (D_H, D_H) => cx(0.0, -2.0),
            (U_H, D_H) => cx(-1.0, 1.0),
            (U_H, D_V) => cx(0.5, -2.5),
        ];

        assert_eq!(op.conj(), op_conj);
        assert_eq!(op.dag(), op_dag);
    }

    #[test]
    fn should_have_same_rows_and_columns_for_identity() {
        let id = operator![
            (D_H, D_H) => cx(1.0, 0.0),
            (D_V, D_V) => cx(1.0, 0.0),
            (U_H, U_H) => cx(1.0, 0.0),
            (U_V, U_V) => cx(1.0, 0.0),
        ];

        let rows_cols = map![
            D_H => vector![D_H => cx(1.0, 0.0)],
            D_V => vector![D_V => cx(1.0, 0.0)],
            U_H => vector![U_H => cx(1.0, 0.0)],
            U_V => vector![U_V => cx(1.0, 0.0)],
        ];

        assert_eq!(id.vector_per_output(), rows_cols);
        assert_eq!(id.vector_per_input(), rows_cols);
    }

    #[test]
    fn should_split_by_inputs_and_outputs() {
        let id = operator![
            (D_H, D_H) => cx(0.0, 2.0),
            (U_H, D_H) => cx(-1.0, -1.0),
            (U_H, D_V) => cx(0.5, 2.5),
        ];

        let by_output = map![
            D_H => vector![D_H => cx(0.0, 2.0), U_H => cx(-1.0, -1.0)],
            D_V => vector![U_H => cx(0.5, 2.5)],
        ];

        let by_input = map![
            D_H => vector![D_H => cx(0.0, 2.0)],
            U_H => vector![D_H => cx(-1.0, -1.0), D_V => cx(0.5, 2.5)],
        ];

        assert_eq!(id.vector_per_output(), by_output);
        assert_eq!(id.vector_per_input(), by_input);
    }

    #[test]
    fn should_map_values() {
        let op = operator![
            (D_H, D_H) => cx(0.0, 2.0),
            (U_H, D_H) => cx(-1.0, -1.0),
            (U_H, D_V) => cx(0.5, 2.5),
        ];

        let op_abs2 = operator![
            (D_H, D_H) => cx(4.0, 0.0),
            (U_H, D_H) => cx(2.0, 0.0),
            (U_H, D_V) => cx(6.5, 0.0),
        ];

        assert_eq!(op.map_values(|&z| z * z.conj()), op_abs2);
    }

    #[test]
    fn should_operate_on_vectors() {
        let id = Operator::identity();

        let op = operator![
            (D_H, D_H) => cx(0.0, 2.0),
            (U_H, D_H) => cx(-1.0, -1.0),
            (U_H, D_V) => cx(0.5, 2.5),
        ];

        let t1 = vector![
            D_H => cx(0.0, 1.0),
            U_H => cx(2.0, 0.0),
            D_V => cx(0.0, 1.0),
        ];

        let t2 = vector![
            D_H => cx(-4.0, -2.0),
            D_V => cx(1.0, 5.0),
        ];

        assert_eq!(&id * &t1, t1);
        assert_eq!(&op * &t1, t2);
    }

    #[test]
    fn should_subtract_operators() {
        let id = operator![
            (D_H, D_H) => cx(1.0, 0.0),
            (D_V, D_V) => cx(1.0, 0.0),
            (U_H, U_H) => cx(1.0, 0.0),
            (U_V, U_V) => cx(1.0, 0.0),
        ];

        let op = operator![
            (D_H, D_H) => cx(1.0, 0.0),
            (D_V, D_V) => cx(-1.0, 0.0),
            (U_H, D_V) => cx(0.5, 0.5),
        ];

        let sub1 = operator![
            (D_V, D_V) => cx(2.0, 0.0),
            (U_H, U_H) => cx(1.0, 0.0),
            (U_V, U_V) => cx(1.0, 0.0),
            (U_H, D_V) => cx(-0.5, -0.5),
        ];

        let sub2 = operator![
            (D_V, D_V) => cx(-2.0, 0.0),
            (U_H, U_H) => cx(-1.0, 0.0),
            (U_V, U_V) => cx(-1.0, 0.0),
            (U_H, D_V) => cx(0.5, 0.5),
        ];

        assert_eq!(id.clone() - &op, sub1);
        assert_eq!(id.clone() - op.clone(), sub1);
        assert_eq!(op.clone() - &id, sub2);
        assert_eq!(op - id, sub2);
    }

    #[test]
    fn should_multiply_operators() {
        let id = operator![
            (D_H, D_H) => cx(1.0, 0.0),
            (D_V, D_V) => cx(1.0, 0.0),
            (U_H, U_H) => cx(1.0, 0.0),
            (U_V, U_V) => cx(1.0, 0.0),
        ];

        let op = operator![
            (D_H, D_H) => cx(0.0, 2.0),
            (U_H, D_H) => cx(-1.0, -1.0),
            (U_H, D_V) => cx(0.5, 2.5),
        ];

        let op2 = operator![
            (D_H, U_H) => cx(1.0, 0.0),
            (U_H, D_H) => cx(1.0, 0.0),
            (D_V, D_V) => cx(0.0, 1.0),
        ];
        let op2_right = operator![
            (U_H, D_H) => cx(0.0, 2.0),
            (D_H, D_H) => cx(-1.0, -1.0),
            (D_H, D_V) => cx(0.5, 2.5),
        ];
        let op2_left = operator![
            (D_H, U_H) => cx(0.0, 2.0),
            (U_H, U_H) => cx(-1.0, -1.0),
            (U_H, D_V) => cx(-2.5, 0.5),
        ];

        assert_eq!(&op * &id, op);
        assert_eq!(&id * &op, op);
        assert_eq!(&op * &op2, op2_right);
        assert_eq!(&op2 * &op, op2_left);
    }

    #[test]
    fn should_compute_partial_multiply() {
        let vec = vector![
            hlist![PositionX(0), Spin::D, Polarization::H, PositionY(0)] => cx(0.0, 1.0),
            hlist![PositionX(1), Spin::U, Polarization::H, PositionY(0)] => cx(2.0, 0.0),
            hlist![PositionX(2), Spin::D, Polarization::V, PositionY(1)] => cx(0.0, 1.0),
            hlist![PositionX(3), Spin::D, Polarization::H, PositionY(1)] => cx(0.0, 1.0),
            hlist![PositionX(4), Spin::U, Polarization::H, PositionY(2)] => cx(2.0, 0.0),
            hlist![PositionX(5), Spin::D, Polarization::V, PositionY(2)] => cx(0.0, 1.0),
            hlist![PositionX(6), Spin::D, Polarization::V, PositionY(3)] => cx(0.0, 1.0),
        ];

        let spin_identity = operator![
            (hlist![Spin::U], hlist![Spin::U]) => cx(1.0, 0.0),
            (hlist![Spin::D], hlist![Spin::D]) => cx(1.0, 0.0),
        ];

        let op1 = operator![
            (D_H, D_H) => cx(0.0, 2.0),
            (U_H, D_H) => cx(-1.0, -1.0),
            (U_H, D_V) => cx(0.5, 2.5),
        ];

        let res1 = vector![
            hlist![PositionX(0), Spin::D, Polarization::H, PositionY(0)] => cx(-2.0, 0.0),
            hlist![PositionX(1), Spin::D, Polarization::H, PositionY(0)] => cx(-2.0, -2.0),
            hlist![PositionX(1), Spin::D, Polarization::V, PositionY(0)] => cx(1.0, 5.0),
            hlist![PositionX(3), Spin::D, Polarization::H, PositionY(1)] => cx(-2.0, 0.0),
            hlist![PositionX(4), Spin::D, Polarization::H, PositionY(2)] => cx(-2.0, -2.0),
            hlist![PositionX(4), Spin::D, Polarization::V, PositionY(2)] => cx(1.0, 5.0),
        ];

        let op2a = operator![
            (hlist![PositionX(2)], hlist![PositionX(4)]) => cx(1.0, 0.0),
            (hlist![PositionX(5)], hlist![PositionX(4)]) => cx(1.0, 0.0),
            (hlist![PositionX(6)], hlist![PositionX(4)]) => cx(1.0, 0.0),
        ];

        let op2b = operator![
            (hlist![PositionY(0)], hlist![PositionY(1)]) => cx(0.0, 0.0),
            (hlist![PositionY(1)], hlist![PositionY(1)]) => cx(1.0, 0.0),
            (hlist![PositionY(2)], hlist![PositionY(1)]) => cx(2.0, 0.0),
            (hlist![PositionY(3)], hlist![PositionY(1)]) => cx(3.0, 0.0),
        ];

        let res2 = vector![
            hlist![PositionX(4), Spin::D, Polarization::V, PositionY(1)] => cx(0.0, 6.0),
        ];

        assert_eq!(spin_identity.mul_vec_partial(&vec), vec);
        assert_eq!(op1.mul_vec_partial(&vec), res1);
        assert_eq!(op2b.mul_vec_partial(&op2a.mul_vec_partial(&vec)), res2);
    }

    #[test]
    fn should_compute_partial_multiply_dynamically() {
        let op_x = operator![
            (hlist![Polarization::H], hlist![Polarization::V]) => cx(1.0, 0.0),
            (hlist![Polarization::V], hlist![Polarization::H]) => cx(1.0, 0.0),
        ];
        let op_y = operator![
            (hlist![Spin::U], hlist![Spin::D]) => cx(0.0, 1.0),
            (hlist![Spin::D], hlist![Spin::U]) => cx(0.0, -1.0),
        ];
        let op_z = operator![
            (hlist![PositionX(0)], hlist![PositionX(1)]) => cx(-1.0, 0.0),
            (hlist![PositionX(1)], hlist![PositionX(2)]) => cx(1.0, 0.0),
        ];

        let vec = vector![
            D_H + hlist![PositionX(0)] => cx(1.0, 0.0),
            D_V + hlist![PositionX(0)] => cx(2.0, 0.0),
            U_H + hlist![PositionX(1)] => cx(3.0, 0.0),
            U_V + hlist![PositionX(1)] => cx(4.0, 0.0),
        ];

        let dyns: Vec<Box<dyn PartialOperator<Hlist![Spin, Polarization, PositionX]>>> =
            vec![op_x.into_dyn(), op_y.into_dyn(), op_z.into_dyn()];

        let multiplied = dyns
            .iter()
            .map(|op| op.mul_vec_partial(&vec))
            .collect::<Vec<_>>();

        assert_eq!(
            multiplied[0],
            vector![
                D_V + hlist![PositionX(0)] => cx(1.0, 0.0),
                D_H + hlist![PositionX(0)] => cx(2.0, 0.0),
                U_V + hlist![PositionX(1)] => cx(3.0, 0.0),
                U_H + hlist![PositionX(1)] => cx(4.0, 0.0),
            ]
        );
        assert_eq!(
            multiplied[1],
            vector![
                U_H + hlist![PositionX(0)] => cx(0.0, -1.0),
                U_V + hlist![PositionX(0)] => cx(0.0, -2.0),
                D_H + hlist![PositionX(1)] => cx(0.0, 3.0),
                D_V + hlist![PositionX(1)] => cx(0.0, 4.0),
            ]
        );

        assert_eq!(
            multiplied[2],
            vector![
                D_H + hlist![PositionX(1)] => cx(-1.0, 0.0),
                D_V + hlist![PositionX(1)] => cx(-2.0, 0.0),
                U_H + hlist![PositionX(2)] => cx(3.0, 0.0),
                U_V + hlist![PositionX(2)] => cx(4.0, 0.0),
            ]
        );
    }
    #[test]
    fn should_compute_outer_product() {
        let op_x = operator![
            (hlist![Polarization::H], hlist![Polarization::V]) => cx(1.0, 0.0),
            (hlist![Polarization::V], hlist![Polarization::H]) => cx(1.0, 0.0),
        ];
        let op_y = operator![
            (hlist![Spin::U], hlist![Spin::D]) => cx(0.0, 1.0),
            (hlist![Spin::D], hlist![Spin::U]) => cx(0.0, -1.0),
        ];
        let op_z = operator![
            (hlist![PositionX(0)], hlist![PositionX(0)]) => cx(1.0, 0.0),
            (hlist![PositionX(1)], hlist![PositionX(1)]) => cx(-1.0, 0.0),
        ];

        let op_res = operator![
            (hlist![Polarization::H, PositionX(0)], hlist![Polarization::V, PositionX(0)]) => cx(1.0, 0.0),
            (hlist![Polarization::H, PositionX(1)], hlist![Polarization::V, PositionX(1)]) => cx(-1.0, 0.0),
            (hlist![Polarization::V, PositionX(0)], hlist![Polarization::H, PositionX(0)]) => cx(1.0, 0.0),
            (hlist![Polarization::V, PositionX(1)], hlist![Polarization::H, PositionX(1)]) => cx(-1.0, 0.0),
        ];

        let id_pol: Operator<Hlist![Polarization]> = Operator::identity();
        let id_spin: Operator<Hlist![Spin]> = Operator::identity();
        let id: Operator<Hlist![Polarization, Spin]> = Operator::identity();

        assert_eq!(id_pol.outer(&id_spin), id);
        assert_eq!(op_x.outer(&op_z).outer(&op_y), op_res.outer(&op_y));
        assert_eq!(op_y.outer(&op_x).outer(&op_z), op_y.outer(&op_res));
    }
}
