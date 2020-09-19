use itertools::{structs::Unique, Itertools};
use std::{
    collections::hash_map::{HashMap, Iter, Keys},
    fmt,
    hash::Hash,
    iter::Chain,
};

pub struct BothMapsIter<'a, K, V1, V2> {
    a_entries: Iter<'a, K, V1>,
    b: &'a HashMap<K, V2>,
}
impl<'a, K, V1, V2> BothMapsIter<'a, K, V1, V2> {
    pub fn new(a: &'a HashMap<K, V1>, b: &'a HashMap<K, V2>) -> Self {
        Self {
            a_entries: a.iter(),
            b,
        }
    }
}

impl<'a, K, V1, V2> Iterator for BothMapsIter<'a, K, V1, V2>
where
    K: Eq + Hash,
{
    type Item = (&'a K, &'a V1, &'a V2);
    fn next(&mut self) -> Option<Self::Item> {
        loop {
            let (k, v) = self.a_entries.next()?;
            match self.b.get(k) {
                None => continue,
                Some(v2) => return Some((k, v, v2)),
            }
        }
    }
}

pub struct EitherMapIter<'a, K, V1, V2> {
    a: &'a HashMap<K, V1>,
    b: &'a HashMap<K, V2>,
    keys: Unique<Chain<Keys<'a, K, V1>, Keys<'a, K, V2>>>,
}
impl<'a, K, V1, V2> EitherMapIter<'a, K, V1, V2>
where
    K: Hash + Eq,
{
    pub fn new(a: &'a HashMap<K, V1>, b: &'a HashMap<K, V2>) -> Self {
        Self {
            a,
            b,
            keys: a.keys().chain(b.keys()).unique(),
        }
    }
}

impl<'a, K, V1, V2> Iterator for EitherMapIter<'a, K, V1, V2>
where
    K: Eq + Hash,
{
    type Item = (&'a K, Option<&'a V1>, Option<&'a V2>);
    fn next(&mut self) -> Option<Self::Item> {
        let key = self.keys.next()?;
        Some((key, self.a.get(key), self.b.get(key)))
    }
}

pub struct MapValues<'a, K, V, F> {
    iter: Iter<'a, K, V>,
    f: F,
}

impl<'a, F, K, V, V2> Iterator for MapValues<'a, K, V, F>
where
    K: Clone,
    F: FnMut(&'a V) -> V2,
{
    type Item = (K, V2);
    fn next(&mut self) -> Option<Self::Item> {
        self.iter.next().map(|(k, v)| (k.clone(), (self.f)(v)))
    }
}

pub trait MapExt<K, V> {
    fn map_values<'a, F, V2>(&'a self, f: F) -> MapValues<'a, K, V, F>
    where
        F: FnMut(&'a V) -> V2;

    fn iter_both<'a, V2>(&'a self, other: &'a HashMap<K, V2>) -> BothMapsIter<'a, K, V, V2>;
    fn iter_either<'a, V2>(&'a self, other: &'a HashMap<K, V2>) -> EitherMapIter<'a, K, V, V2>
    where
        K: Hash + Eq;
}

impl<K, V> MapExt<K, V> for HashMap<K, V> {
    fn map_values<'a, F, V2>(&'a self, f: F) -> MapValues<'a, K, V, F>
    where
        F: FnMut(&'a V) -> V2,
    {
        MapValues {
            iter: self.iter(),
            f,
        }
    }

    fn iter_both<'a, V2>(&'a self, other: &'a HashMap<K, V2>) -> BothMapsIter<'a, K, V, V2> {
        BothMapsIter::new(self, other)
    }

    fn iter_either<'a, V2>(&'a self, other: &'a HashMap<K, V2>) -> EitherMapIter<'a, K, V, V2>
    where
        K: Hash + Eq,
    {
        EitherMapIter::new(self, other)
    }
}

use frunk::{
    hlist::{HCons, HNil},
    indices::{Here, There},
};

// reverse of Plucker
pub trait Inserter<T, Index> {
    type Inserted;
    fn insert(self, value: T) -> Self::Inserted;
}

impl<T> Inserter<T, Here> for HNil {
    type Inserted = HCons<T, HNil>;

    #[inline(always)]
    fn insert(self, value: T) -> Self::Inserted {
        HCons {
            head: value,
            tail: self,
        }
    }
}

/// Implementation when the inserter index is in head
impl<T, Head, Tail> Inserter<T, Here> for HCons<Head, Tail> {
    type Inserted = HCons<T, Self>;

    #[inline(always)]
    fn insert(self, value: T) -> Self::Inserted {
        HCons {
            head: value,
            tail: self,
        }
    }
}

/// Implementation when the inserter index is in the tail
impl<Head, Tail, T, TailIndex> Inserter<T, There<TailIndex>> for HCons<Head, Tail>
where
    Tail: Inserter<T, TailIndex>,
{
    type Inserted = HCons<Head, Tail::Inserted>;
    #[inline(always)]
    fn insert(self, value: T) -> Self::Inserted {
        HCons {
            head: self.head,
            tail: self.tail.insert(value),
        }
    }
}

/// Reverse of Sculptor
/// Given the scuplted output, rest and used indices, recombine them together.
pub trait Joiner<Values, Indices> {
    type Joined;

    fn join(self, values: Values) -> Self::Joined;
}

impl<Source> Joiner<HNil, HNil> for Source {
    type Joined = Source;

    #[inline(always)]
    fn join(self, _: HNil) -> Source {
        self
    }
}

pub trait BumpIndices {
    type Bumped;
}
impl BumpIndices for HNil {
    type Bumped = HNil;
}
impl<Head, Tail: BumpIndices> BumpIndices for HCons<Head, Tail> {
    type Bumped = HCons<There<Head>, Tail::Bumped>;
}

/// Implementation for when we have a non-empty HCons target
impl<T, VHead, VTail, IndexHead, IndexTail> Joiner<HCons<VHead, VTail>, HCons<IndexHead, IndexTail>>
    for T
where
    IndexTail: BumpIndices,
    T: Inserter<VHead, IndexHead>,
    <T as Inserter<VHead, IndexHead>>::Inserted: Joiner<VTail, IndexTail::Bumped>,
{
    type Joined =
        <<T as Inserter<VHead, IndexHead>>::Inserted as Joiner<VTail, IndexTail::Bumped>>::Joined;

    #[inline(always)]
    fn join(self, values: HCons<VHead, VTail>) -> Self::Joined {
        let HCons { head, tail } = values;
        self.insert(head).join(tail)
    }
}

/// Pretty printing for hlists
pub trait DebugHlist {
    fn add_debug_entry(&self, list: &mut fmt::DebugList);
}

impl DebugHlist for HNil {
    #[inline(always)]
    fn add_debug_entry(&self, _: &mut fmt::DebugList) {}
}

impl<Head, Tail> DebugHlist for HCons<Head, Tail>
where
    Head: fmt::Debug,
    Tail: DebugHlist,
{
    #[inline(always)]
    fn add_debug_entry(&self, list: &mut fmt::DebugList) {
        list.entry(&self.head);
        self.tail.add_debug_entry(list);
    }
}

// wrapper for debug printing hlist using Debug trait
pub struct HlistPrint<'a, T>(pub &'a T);
impl<'a, T> fmt::Debug for HlistPrint<'a, T>
where
    T: DebugHlist,
{
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let mut list = f.debug_list();
        self.0.add_debug_entry(&mut list);
        list.finish()
    }
}

#[macro_export]
macro_rules! map {
    { $($key:expr => $value:expr),*$(,)? } => {{
        let mut m = ::std::collections::HashMap::new();
        $(m.insert($key, $value);)*
        m
    }};
}

#[macro_export]
macro_rules! operator {
    { $($key:expr => $value:expr),*$(,)? } => {{
        let mut op = crate::Operator::new();
        $(op.insert($key, $value);)*
        op
    }};
}

#[macro_export]
macro_rules! tensor {
    { $($key:expr => $value:expr),*$(,)? } => {{
        let mut t = crate::Tensor::new();
        $(t.insert($key, $value);)*
        t
    }};
}

#[cfg(test)]
mod tests {
    use super::*;
    use frunk::hlist::Sculptor;

    #[derive(Debug, Clone, Copy, PartialEq)]
    struct A;
    #[derive(Debug, Clone, Copy, PartialEq)]
    struct B;
    #[derive(Debug, Clone, Copy, PartialEq)]
    struct C;
    #[derive(Debug, Clone, Copy, PartialEq)]
    struct D;

    #[derive(Debug, Clone, Copy, PartialEq)]
    struct X(u32);
    #[derive(Debug, Clone, Copy, PartialEq)]
    struct Y(u32);
    #[derive(Debug, Clone, Copy, PartialEq)]
    struct Z(u32);

    type Zero = Here;
    type One = There<Zero>;
    type Two = There<One>;
    type Three = There<Two>;

    #[test]
    fn test_inserter() {
        let h = hlist![A, B, C];
        assert_eq!(Inserter::<_, Zero>::insert(h, D), hlist![D, A, B, C]);
        assert_eq!(Inserter::<_, One>::insert(h, D), hlist![A, D, B, C]);
        assert_eq!(Inserter::<_, Two>::insert(h, D), hlist![A, B, D, C]);
        assert_eq!(Inserter::<_, Three>::insert(h, D), hlist![A, B, C, D]);
    }

    #[test]
    fn test_joiner() {
        assert_eq!(
            Joiner::<_, Hlist![Zero, Zero]>::join(hlist![A, B], hlist![C, D]),
            hlist![C, D, A, B]
        );

        assert_eq!(
            Joiner::<_, Hlist![Zero, Zero]>::join(hlist![], hlist![C, D]),
            hlist![C, D]
        );
    }

    #[test]
    fn test_joiner_roundtrip() {
        fn replace_some<A, B, Indices>(a: A, b: B) -> <A::Remainder as Joiner<B, Indices>>::Joined
        where
            A: Sculptor<B, Indices>,
            A::Remainder: Joiner<B, Indices>,
        {
            let (_t, rest) = Sculptor::sculpt(a);
            Joiner::join(rest, b)
        }

        assert_eq!(
            replace_some(
                hlist![A, B, X(10), C, Y(15), Z(5), D],
                hlist![A, X(3), Z(3)]
            ),
            hlist![A, B, X(3), C, Y(15), Z(3), D]
        );
    }
}
