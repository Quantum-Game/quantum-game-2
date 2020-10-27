mod dimensions;
mod elements;

pub use dimensions::*;
pub use elements::*;

use crate::{
    operator::PartialDims, util::RepeatIter, Complex, Dims, Operator, PartialOperator, Vector,
};
use alloc::vec::Vec;
use core::mem::replace;
use frunk::{
    indices::{Here, There},
    HNil,
};
use hashbrown::hash_map::HashMap;
use wasm_bindgen::prelude::*;

#[derive(Debug, Clone, PartialEq)]
pub struct Grid {
    pub width: u16,
    pub height: u16,
    pub elements: HashMap<Coord, Element>,
}

pub struct Simulation {
    width: u16,
    height: u16,
    localized_ops_diff: Operator<SinglePhotonDims>,
}

#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Absorption {
    pub coord: Coord,
    pub photon_id: u32,
    pub probability: f32,
}

type PhotonHlist<Tail = HNil> = Hlist![Coord, Direction, Polarization, ...Tail];
type FirstPhotonIndices = Hlist![Here, Here, Here];

pub trait NextIndices {
    type Next;
}

type PlusThree<T> = There<There<There<T>>>;
impl<A, B, C, Tail> NextIndices for Hlist![A, B, C, ...Tail] {
    type Next = Hlist![PlusThree<A>, PlusThree<B>, PlusThree<C>];
}

pub trait MultiPhotonInteract<I, O, T> {
    type RevIndices;
    fn interact_diff(vec: &Vector<T>, operator: &Operator<I, O>) -> (Vector<T>, Vector<T>);
}

impl<I: Dims, O: Dims, T> MultiPhotonInteract<I, O, T> for PhotonHlist
where
    T: PartialDims<I, O, FirstPhotonIndices>,
{
    type RevIndices = FirstPhotonIndices;
    #[inline(always)]
    fn interact_diff(vec: &Vector<T>, operator: &Operator<I, O>) -> (Vector<T>, Vector<T>) {
        let diff = operator.mul_vec_partial(vec);
        (&diff + vec, diff)
    }
}

type NextIndicesIter<I, O, T, Tail> =
    <<PhotonHlist<Tail> as MultiPhotonInteract<I, O, T>>::RevIndices as NextIndices>::Next;

impl<I: Dims, O: Dims, T: Dims, Tail> MultiPhotonInteract<I, O, T>
    for PhotonHlist<PhotonHlist<Tail>>
where
    PhotonHlist<Tail>: MultiPhotonInteract<I, O, T>,
    <PhotonHlist<Tail> as MultiPhotonInteract<I, O, T>>::RevIndices: NextIndices,
    T: PartialDims<I, O, NextIndicesIter<I, O, T, Tail>>,
{
    type RevIndices = NextIndicesIter<I, O, T, Tail>;
    #[inline(always)]
    fn interact_diff(vec: &Vector<T>, operator: &Operator<I, O>) -> (Vector<T>, Vector<T>) {
        let (vec, prev_diff) =
            <PhotonHlist<Tail> as MultiPhotonInteract<I, O, T>>::interact_diff(vec, operator);
        let diff = operator.mul_vec_partial(&vec);
        (vec + &diff, prev_diff + diff)
    }
}

pub trait MultiPhotonDims: Dims + for<'a> RepeatIter<'a, SinglePhotonDims> {}
impl<T> MultiPhotonDims for T where T: Dims + for<'a> RepeatIter<'a, SinglePhotonDims> {}

/// Manually implemented photon state vector operator
/// that propagates the photons along their direction
/// and removes the state out of simulation bounds.
struct PropagateAndCullOperator {
    width: u16,
    height: u16,
}

impl<E: MultiPhotonDims> PartialOperator<E> for PropagateAndCullOperator {
    fn mul_vec_partial(&self, vector: &Vector<E>) -> Vector<E> {
        Vector::from_values(vector.values().iter().filter_map(|(dims, val)| {
            let mut new_dims = dims.clone();

            for hlist_pat![coord, dir, ...] in new_dims.iter_mut() {
                match dir {
                    Direction::Right => {
                        coord.x = coord.x.checked_add(1).filter(|x| x < &self.width)?;
                    }
                    Direction::Up => {
                        coord.y = coord.y.checked_sub(1)?;
                    }
                    Direction::Left => {
                        coord.x = coord.x.checked_sub(1)?;
                    }
                    Direction::Down => {
                        coord.y = coord.y.checked_add(1).filter(|y| y < &self.height)?;
                    }
                };
            }

            Some((new_dims, *val))
        }))
    }
}

fn absorptions<E: MultiPhotonDims>(original: &Vector<E>, diff: &Vector<E>) -> Vec<Absorption>
where
    Vector<E>: core::fmt::Debug,
{
    let mut map: HashMap<(Coord, u32), f32> = HashMap::new();
    for (dims, diff_value) in diff.values() {
        for (photon_id, hlist_pat![coord, ...]) in dims.iter().enumerate() {
            let old_value = original.get(dims).unwrap_or(Complex::ZERO);
            let new_value = old_value + *diff_value;
            let absorption = old_value.abs2() - new_value.abs2();
            if absorption.abs() > 1.0e-6 {
                map.entry((*coord, photon_id as u32))
                    .and_modify(|v| *v += absorption)
                    .or_insert(absorption);
            }
        }
    }

    map.into_iter()
        .filter(|(_, probability)| probability.abs() > 1.0e-6)
        .map(|((coord, photon_id), probability)| Absorption {
            coord,
            photon_id,
            probability,
        })
        .collect()
}

impl Simulation {
    pub fn new(grid: &Grid) -> Self {
        let dir_pol_identity = Operator::<DimDirPol>::identity();

        Self {
            width: grid.width,
            height: grid.height,
            localized_ops_diff: grid
                .elements
                .iter()
                .map(|(coord, elem)| {
                    coord
                        .as_indicator()
                        .outer(&(elem.operator() - &dir_pol_identity))
                })
                .sum(),
        }
    }

    /// Propagate photon states according to their directions
    pub fn propagate<D: MultiPhotonDims>(&self, vector: &Vector<D>) -> Vector<D> {
        let op = PropagateAndCullOperator {
            width: self.width,
            height: self.height,
        };
        op.mul_vec_partial(vector)
    }

    fn propagate_and_interact<
        D: MultiPhotonDims + MultiPhotonInteract<SinglePhotonDims, SinglePhotonDims, D>,
    >(
        &self,
        vector: &Vector<D>,
    ) -> (Vector<D>, Vec<Absorption>)
    where
        Vector<D>: core::fmt::Debug,
    {
        let propagated = self.propagate(vector);

        let (interacted, diff) = D::interact_diff(&propagated, &self.localized_ops_diff);

        // this assumes single photon

        (interacted, absorptions(&propagated, &diff))
    }

    pub fn simulate<
        'a,
        D: MultiPhotonDims + MultiPhotonInteract<SinglePhotonDims, SinglePhotonDims, D>,
    >(
        &'a self,
        initial_state: &'a Vector<D>,
    ) -> impl Iterator<Item = (Vector<D>, Vec<Absorption>)> + 'a
    where
        Vector<D>: core::fmt::Debug,
    {
        let state = if initial_state.norm_squared() > 1e-6 {
            SimulateIterState::Generating(initial_state.clone(), Vec::new())
        } else {
            SimulateIterState::Done
        };

        SimulateIter { sim: self, state }
    }
}

struct SimulateIter<'a, D> {
    state: SimulateIterState<D>,
    sim: &'a Simulation,
}

enum SimulateIterState<D> {
    Generating(Vector<D>, Vec<Absorption>),
    Done,
}

impl<'a, D> Iterator for SimulateIter<'a, D>
where
    D: MultiPhotonDims + MultiPhotonInteract<SinglePhotonDims, SinglePhotonDims, D>,
    Vector<D>: core::fmt::Debug,
{
    type Item = (Vector<D>, Vec<Absorption>);
    fn next(&mut self) -> Option<Self::Item> {
        loop {
            match &self.state {
                SimulateIterState::Done => return None,
                SimulateIterState::Generating(vec, _) => {
                    let (next_vec, absorptions) = self.sim.propagate_and_interact(&vec);
                    let new_state = if absorptions.is_empty() && next_vec.norm_squared() < 1e-6 {
                        SimulateIterState::Done
                    } else {
                        SimulateIterState::Generating(next_vec, absorptions)
                    };
                    if let SimulateIterState::Generating(vec, absorptions) =
                        replace(&mut self.state, new_state)
                    {
                        return Some((vec, absorptions));
                    } else {
                        unreachable!()
                    }
                }
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{map, vector, Complex};

    fn grid_with_elem(elem: Element) -> Grid {
        Grid {
            width: 5,
            height: 5,
            elements: map![Coord::new(2, 2) => elem],
        }
    }

    fn sim_with_elem(elem: Element) -> Simulation {
        Simulation::new(&grid_with_elem(elem))
    }

    macro_rules! expand_dir {
        (>) => {
            Direction::Right
        };
        (^) => {
            Direction::Up
        };
        (<) => {
            Direction::Left
        };
        (v) => {
            Direction::Down
        };
        ($name:ident) => {
            Direction::$name
        };
    }

    macro_rules! state {
        ($($x:expr, $y:expr, $dir:tt, $pol:ident)|+) => {
            hlist![$(Coord { x: $x, y: $y }, expand_dir!($dir), Polarization::$pol),+]
        };
    }

    macro_rules! photon {
        ($($($st:tt),*)|+) => {
            vector![state![$($($st),*)|+] => Complex::ONE]
        };
    }

    #[test]
    fn should_operate_on_single_photon() {
        let simulation = sim_with_elem(Element::Mirror(Angle::DownLeft));
        let one_photon = photon![0, 2, >, H];
        let mut sim = simulation.simulate(&one_photon);

        let frame1 = photon![1, 2, >, H];
        let frame2 = photon![2, 2, ^, H];
        let frame3 = photon![2, 1, ^, H];
        let frame4 = photon![2, 0, ^, H];

        assert_eq!(sim.next(), Some((one_photon.clone(), Vec::new())));
        assert_eq!(sim.next(), Some((frame1, Vec::new())));
        assert_eq!(sim.next(), Some((frame2, Vec::new())));
        assert_eq!(sim.next(), Some((frame3, Vec::new())));
        assert_eq!(sim.next(), Some((frame4, Vec::new())));
        assert_eq!(sim.next(), None);
    }

    #[test]
    fn should_operate_on_two_photons() {
        let simulation = Simulation::new(&Grid {
            width: 5,
            height: 5,
            elements: map![Coord::new(2, 2) => Element::Mirror(Angle::DownLeft)],
        });

        let two_photons = photon![1, 2, >, H | 2, 4, ^, V];

        let mut sim = simulation.simulate(&two_photons);
        assert_eq!(sim.next(), Some((two_photons.clone(), Vec::new())));
        assert_eq!(
            sim.next(),
            Some((photon![2, 2, ^, H | 2, 3, ^, V], Vec::new()))
        );
        assert_eq!(
            sim.next(),
            Some((-photon![2, 1, ^, H | 2, 2, >, V], Vec::new()))
        );
        assert_eq!(
            sim.next(),
            Some((-photon![2, 0, ^, H | 3, 2, >, V], Vec::new()))
        );
    }
}
