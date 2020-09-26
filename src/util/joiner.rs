use super::Inserter;
use frunk::{
    hlist::{HCons, HNil},
    indices::There,
};

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

#[cfg(test)]
mod tests {
    use super::*;
    use frunk::{hlist::Sculptor, indices::Here};

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

    #[test]
    fn test_joiner() {
        assert_eq!(
            Joiner::<_, Hlist![Here, Here]>::join(hlist![A, B], hlist![C, D]),
            hlist![C, D, A, B]
        );

        assert_eq!(
            Joiner::<_, Hlist![Here, Here]>::join(hlist![], hlist![C, D]),
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
