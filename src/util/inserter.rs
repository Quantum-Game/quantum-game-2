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

#[cfg(test)]
mod tests {
    use super::*;

    #[derive(Debug, Clone, Copy, PartialEq)]
    struct A;
    #[derive(Debug, Clone, Copy, PartialEq)]
    struct B;
    #[derive(Debug, Clone, Copy, PartialEq)]
    struct C;
    #[derive(Debug, Clone, Copy, PartialEq)]
    struct D;

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
}
