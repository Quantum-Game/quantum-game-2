use frunk::{HCons, HNil};
use std::{
    iter::{once, Chain, Once},
    marker::PhantomData,
};

/// This module provides some built-in dimension types, but there is nothing
/// special about them, and user should be able to implement one themelves.
///
/// All dimension types must implement `Debug, Clone, Copy, Eq, PartialEq, Hash`

#[derive(Debug, Clone, Copy, Eq, PartialEq, Hash)]
pub enum Polarization {
    H,
    V,
}

#[derive(Debug, Clone, Copy, Eq, PartialEq, Hash)]
pub enum Spin {
    U,
    D,
}

#[derive(Debug, Clone, Copy, Eq, PartialEq, Hash)]
pub struct PositionX(pub u32);

#[derive(Debug, Clone, Copy, Eq, PartialEq, Hash)]
pub struct PositionY(pub u32);

/// Enumerate all possible values for given dimension
pub trait Enumerable: Sized {
    type Iter: Iterator<Item = Self>;
    fn enumerate() -> Self::Iter;
}

impl Enumerable for Spin {
    type Iter = Chain<Once<Spin>, Once<Spin>>;
    fn enumerate() -> Self::Iter {
        once(Spin::U).chain(once(Spin::D))
    }
}

impl Enumerable for Polarization {
    type Iter = Chain<Once<Polarization>, Once<Polarization>>;
    fn enumerate() -> Self::Iter {
        once(Polarization::H).chain(once(Polarization::V))
    }
}

impl Enumerable for HNil {
    type Iter = Once<HNil>;
    fn enumerate() -> Self::Iter {
        once(HNil)
    }
}
impl<Head: Enumerable + Clone, Tail: Enumerable> Enumerable for HCons<Head, Tail> {
    type Iter = EnumerateConsIter<Head, Tail>;
    fn enumerate() -> Self::Iter {
        let mut values = Head::enumerate();
        EnumerateConsIter {
            current: values.next(),
            head: values,
            tail: Tail::enumerate(),
            marker: PhantomData,
        }
    }
}

pub struct EnumerateConsIter<Head: Enumerable, Tail: Enumerable> {
    head: Head::Iter,
    tail: Tail::Iter,
    current: Option<Head>,
    marker: PhantomData<Tail>,
}

impl<Head: Enumerable + Clone, Tail: Enumerable> Iterator for EnumerateConsIter<Head, Tail> {
    type Item = HCons<Head, Tail>;
    fn next(&mut self) -> Option<Self::Item> {
        loop {
            let head = self.current.as_ref().cloned()?;
            match self.tail.next() {
                Some(tail) => return Some(HCons { head, tail }),
                None => {
                    self.current = self.head.next();
                    self.tail = Tail::enumerate();
                }
            }
        }
    }
}
