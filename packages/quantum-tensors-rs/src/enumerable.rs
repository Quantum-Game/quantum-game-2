use core::marker::PhantomData;
use frunk::{HCons, HNil};

/// Enumerate all possible values for given dimension
pub trait Enumerable: Sized {
    type Iter: Iterator;
    fn enumerate() -> Self::Iter;
}

/// returns None when T doesn't enumerate exactly two values
pub fn enumerate_two<T: Enumerable>() -> Option<(EnumItem<T>, EnumItem<T>)> {
    let mut iter = T::enumerate();
    let a = iter.next()?;
    let b = iter.next()?;
    match iter.next() {
        None => Some((a, b)),
        Some(_) => None,
    }
}

pub type EnumItem<E> = <<E as Enumerable>::Iter as Iterator>::Item;

impl Enumerable for HNil {
    type Iter = core::iter::Once<HNil>;
    fn enumerate() -> Self::Iter {
        core::iter::once(HNil)
    }
}

impl<Head: Enumerable, Tail: Enumerable> Enumerable for HCons<Head, Tail>
where
    EnumItem<Head>: Clone,
{
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
    current: Option<EnumItem<Head>>,
    marker: PhantomData<Tail>,
}

impl<Head: Enumerable, Tail: Enumerable> Iterator for EnumerateConsIter<Head, Tail>
where
    EnumItem<Head>: Clone,
{
    type Item = HCons<EnumItem<Head>, EnumItem<Tail>>;
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
