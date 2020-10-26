use frunk::{
    indices::{Here, There},
    HCons, HNil,
};
use std::iter::{empty, once, Chain, Empty, Once};

trait NumAdd<T> {
    type Sum;
}

impl<T> NumAdd<Here> for T {
    type Sum = T;
}

impl<A, T> NumAdd<There<A>> for T
where
    A: NumAdd<T>,
{
    type Sum = There<A::Sum>;
}

trait NumMul<T> {
    type Mul;
}

impl<T> NumMul<Here> for T {
    type Mul = Here;
}

impl<A, T> NumMul<There<A>> for T
where
    T: NumMul<A>,
    T: NumAdd<<T as NumMul<A>>::Mul>,
{
    type Mul = T::Sum;
}

pub trait Len {
    type Len;
}

impl Len for HNil {
    type Len = Here;
}

impl<Head, Tail> Len for HCons<Head, Tail>
where
    Tail: Len,
{
    type Len = There<Tail::Len>;
}

// trait Repeated<T> {}

// impl<Head> Repeated<HCons<Head, HNil>> for HCons<Head, HNil> {}
// impl<Head, Tail> Repeated<HCons<Head, Tail>> for HCons<Head, Tail> {}

pub trait Repeat<N> {
    type Repeated;
}

impl<T> Repeat<Here> for T {
    type Repeated = HNil;
}

impl<T, N> Repeat<There<N>> for T
where
    T: Repeat<N>,
{
    type Repeated = HCons<T, T::Repeated>;
}

pub trait TakeFirst<Count> {
    type First;
    type Rest;
}

impl<T> TakeFirst<Here> for T {
    type First = HNil;
    type Rest = T;
}

impl<Head, Tail, N> TakeFirst<There<N>> for HCons<Head, Tail>
where
    Tail: TakeFirst<N>,
{
    type First = HCons<Head, Tail::First>;
    type Rest = Tail::Rest;
}

pub trait Repeated<T> {
    type Count;
}

impl<T> Repeated<T> for HNil {
    type Count = Here;
}

impl<Init, Head, Tail> Repeated<Init> for HCons<Head, Tail>
where
    Init: Len,
    HCons<Head, Tail>: TakeFirst<Init::Len, First = Init>,
    <HCons<Head, Tail> as TakeFirst<Init::Len>>::Rest: Repeated<Init>,
{
    type Count =
        There<<<HCons<Head, Tail> as TakeFirst<Init::Len>>::Rest as Repeated<Init>>::Count>;
}

pub trait RepeatIter<'a, R: 'a>
where
    R: SelectSeq<'a>,
{
    type Iter: Iterator<Item = R::Selected>;
    type IterMut: Iterator<Item = R::SelectedMut>;
    fn iter(&'a self) -> Self::Iter;
    fn iter_mut(&'a mut self) -> Self::IterMut;
}

impl<'a, R: 'a> RepeatIter<'a, R> for HNil
where
    R: Len,
    R: SelectSeq<'a>,
{
    type Iter = Empty<R::Selected>;
    type IterMut = Empty<R::SelectedMut>;
    fn iter(&'a self) -> Self::Iter {
        empty()
    }
    fn iter_mut(&'a mut self) -> Self::IterMut {
        empty()
    }
}

impl<'a, R: 'a, Head, Tail> RepeatIter<'a, R> for HCons<Head, Tail>
where
    R: Len,
    R: SelectSeq<'a>,
    <Self as SelectSeq<'a, Here, R::Len>>::Rest: RepeatIter<'a, R>,
    Self: SelectSeq<'a, Here, R::Len, Selected = R::Selected, SelectedMut = R::SelectedMut>,
{
    type Iter = Chain<
        Once<R::Selected>,
        <<Self as SelectSeq<'a, Here, R::Len>>::Rest as RepeatIter<'a, R>>::Iter,
    >;
    type IterMut = Chain<
        Once<R::SelectedMut>,
        <<Self as SelectSeq<'a, Here, R::Len>>::Rest as RepeatIter<'a, R>>::IterMut,
    >;
    fn iter(&'a self) -> Self::Iter {
        let (head, rest) = self.select();
        once(head).chain(rest.iter())
    }
    fn iter_mut(&'a mut self) -> Self::IterMut {
        let (head, rest) = self.select_mut();
        once(head).chain(rest.iter_mut())
    }
}

// trait RepeatIter

pub trait SelectSeq<'a, Start = Here, Count = <Self as Len>::Len>
where
    Self: Len,
{
    type Selected;
    type SelectedMut;
    type Rest;
    fn select(&'a self) -> (Self::Selected, &'a Self::Rest);
    fn select_mut(&'a mut self) -> (Self::SelectedMut, &'a mut Self::Rest);
}

impl<'a, T> SelectSeq<'a, Here, Here> for T
where
    T: Len,
{
    type Selected = HNil;
    type SelectedMut = HNil;
    type Rest = T;
    fn select(&'a self) -> (Self::Selected, &'a Self::Rest) {
        (HNil, self)
    }
    fn select_mut(&'a mut self) -> (Self::SelectedMut, &'a mut Self::Rest) {
        (HNil, self)
    }
}

impl<'a, T: 'a, Tail, Next> SelectSeq<'a, Here, There<Next>> for HCons<T, Tail>
where
    Tail: SelectSeq<'a, Here, Next>,
{
    type Selected = HCons<&'a T, Tail::Selected>;
    type SelectedMut = HCons<&'a mut T, Tail::SelectedMut>;
    type Rest = Tail::Rest;
    fn select(&'a self) -> (Self::Selected, &'a Self::Rest) {
        let (tail, rest) = self.tail.select();
        (
            HCons {
                head: &self.head,
                tail,
            },
            rest,
        )
    }
    fn select_mut(&'a mut self) -> (Self::SelectedMut, &'a mut Self::Rest) {
        let (tail, rest) = self.tail.select_mut();

        (
            HCons {
                head: &mut self.head,
                tail,
            },
            rest,
        )
    }
}

impl<'a, Head, Start, Count, Tail> SelectSeq<'a, There<Start>, Count> for HCons<Head, Tail>
where
    Tail: SelectSeq<'a, Start, Count>,
{
    type Selected = Tail::Selected;
    type SelectedMut = Tail::SelectedMut;
    type Rest = Tail::Rest;
    fn select(&'a self) -> (Self::Selected, &'a Self::Rest) {
        self.tail.select()
    }
    fn select_mut(&'a mut self) -> (Self::SelectedMut, &'a mut Self::Rest) {
        self.tail.select_mut()
    }
}

#[cfg(test)]
mod test {
    use super::*;
    type One = There<Here>;
    type Two = There<One>;
    type Three = There<Two>;
    type Four = There<Three>;
    type Five = There<Four>;
    type Six = There<Five>;

    struct A;
    struct B;
    struct C;

    type Abc = Hlist![A, B, C];

    trait TypeEq {}
    impl<A> TypeEq for (A, A) {}
    fn type_eq<X: TypeEq>() {}
    fn repeated<X, Y: Repeated<X>>() {}

    #[test]
    fn test() {
        type_eq::<(Here, <Here as NumAdd<Here>>::Sum)>();
        type_eq::<(One, <One as NumAdd<Here>>::Sum)>();
        type_eq::<(One, <Here as NumAdd<One>>::Sum)>();
        type_eq::<(Two, <Two as NumAdd<Here>>::Sum)>();
        type_eq::<(Four, <Two as NumAdd<Two>>::Sum)>();

        type_eq::<(Here, <Here as NumMul<Here>>::Mul)>();
        type_eq::<(Here, <Two as NumMul<Here>>::Mul)>();
        type_eq::<(Here, <Here as NumMul<Two>>::Mul)>();
        type_eq::<(Two, <One as NumMul<Two>>::Mul)>();
        type_eq::<(Four, <Two as NumMul<Two>>::Mul)>();
        type_eq::<(Six, <Six as NumMul<One>>::Mul)>();
        type_eq::<(Six, <Three as NumMul<Two>>::Mul)>();

        repeated::<Abc, HNil>();
        repeated::<Abc, Abc>();
        repeated::<Abc, Hlist![A, B, C, A, B, C]>();
    }
}
