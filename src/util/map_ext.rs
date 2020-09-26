use std::{
    collections::hash_map::{HashMap, Iter, Keys},
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
    visited: HashMap<K, ()>,
    keys: Chain<Keys<'a, K, V1>, Keys<'a, K, V2>>,
}
impl<'a, K, V1, V2> EitherMapIter<'a, K, V1, V2>
where
    K: Hash + Eq,
{
    pub fn new(a: &'a HashMap<K, V1>, b: &'a HashMap<K, V2>) -> Self {
        Self {
            a,
            b,
            visited: HashMap::new(),
            keys: a.keys().chain(b.keys()),
        }
    }
}

impl<'a, K, V1, V2> Iterator for EitherMapIter<'a, K, V1, V2>
where
    K: Eq + Hash + Clone,
{
    type Item = (&'a K, Option<&'a V1>, Option<&'a V2>);
    fn next(&mut self) -> Option<Self::Item> {
        while let Some(key) = self.keys.next() {
            if self.visited.insert(key.clone(), ()).is_none() {
                return Some((key, self.a.get(key), self.b.get(key)));
            }
        }
        None
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
