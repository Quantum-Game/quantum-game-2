use core::fmt;
use frunk::{HCons, HNil};

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
