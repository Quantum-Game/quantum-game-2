use alloc::vec::Vec;
use hashbrown::hash_map::HashMap;
mod dimensions;
mod elements;

pub use dimensions::*;
pub use elements::*;

use crate::{operator::PartialDims, util::RepeatIter, Dims, Operator, PartialOperator, Vector};
use frunk::{
    indices::{Here, There},
    HNil,
};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct Coord {
    pub x: u16,
    pub y: u16,
}

impl Coord {
    pub fn new(x: u16, y: u16) -> Coord {
        Coord { x, y }
    }
    pub fn as_indicator(&self) -> Operator<Hlist![PosX, PosY]> {
        Operator::indicator(hlist![PosX(self.x), PosY(self.y)])
    }
}

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

type PhotonHlist<Tail = HNil> = Hlist![PosX, PosY, Direction, Polarization, ...Tail];
type FirstPhotonIndices = Hlist![Here, Here, Here, Here];

pub trait NextIndices {
    type Next;
}

type PlusFour<T> = There<There<There<There<T>>>>;
impl<A, B, C, D, Tail> NextIndices for Hlist![A, B, C, D, ...Tail] {
    type Next = Hlist![PlusFour<A>, PlusFour<B>, PlusFour<C>, PlusFour<D>];
}

pub trait MultiPhotonInteract<I, O, T> {
    type RevIndices;
    fn interact(vec: &Vector<T>, operator: &Operator<I, O>) -> Vector<T>;
}

impl<I: Dims, O: Dims, T> MultiPhotonInteract<I, O, T> for PhotonHlist
where
    T: PartialDims<I, O, FirstPhotonIndices>,
{
    type RevIndices = FirstPhotonIndices;
    #[inline(always)]
    fn interact(vec: &Vector<T>, operator: &Operator<I, O>) -> Vector<T> {
        operator.mul_vec_partial(vec) + vec
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
    fn interact(vec: &Vector<T>, operator: &Operator<I, O>) -> Vector<T> {
        let vec = <PhotonHlist<Tail> as MultiPhotonInteract<I, O, T>>::interact(vec, operator);
        operator.mul_vec_partial(&vec) + vec
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

            for hlist_pat![pos_x, pos_y, dir, ...] in new_dims.iter_mut() {
                match dir {
                    Direction::Right => {
                        pos_x.0 = pos_x.0.checked_add(1).filter(|x| x < &self.width)?;
                    }
                    Direction::Up => {
                        pos_y.0 = pos_y.0.checked_sub(1)?;
                    }
                    Direction::Left => {
                        pos_x.0 = pos_x.0.checked_sub(1)?;
                    }
                    Direction::Down => {
                        pos_y.0 = pos_y.0.checked_add(1).filter(|y| y < &self.height)?;
                    }
                };
            }

            Some((new_dims, *val))
        }))
    }
}

type OnePhotonDims = PhotonHlist<HNil>;
type TwoPhotonDims = PhotonHlist<OnePhotonDims>;
type ThreePhotonDims = PhotonHlist<TwoPhotonDims>;

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
    ) -> Vector<D>
    where
        Vector<D>: core::fmt::Debug,
    {
        D::interact(&self.propagate(vector), &self.localized_ops_diff)
    }

    pub fn simulate<
        'a,
        D: MultiPhotonDims + MultiPhotonInteract<SinglePhotonDims, SinglePhotonDims, D>,
    >(
        &'a self,
        initial_state: &'a Vector<D>,
    ) -> impl Iterator<Item = Vector<D>> + 'a
    where
        Vector<D>: core::fmt::Debug,
    {
        SimulateIter {
            sim: self,
            state: SimulateIterState::Initial(initial_state),
        }
    }

    // non-generic methods for FFI
    pub fn simulate_one(
        &self,
        max_frames: usize,
        v: &Vector<OnePhotonDims>,
    ) -> Vec<Vector<OnePhotonDims>> {
        self.simulate(v).take(max_frames).collect()
    }

    pub fn simulate_two(
        &self,
        max_frames: usize,
        v: &Vector<TwoPhotonDims>,
    ) -> Vec<Vector<TwoPhotonDims>> {
        self.simulate(v).take(max_frames).collect()
    }

    pub fn simulate_three(
        &self,
        max_frames: usize,
        v: &Vector<ThreePhotonDims>,
    ) -> Vec<Vector<ThreePhotonDims>> {
        self.simulate(v).take(max_frames).collect()
    }
}

struct SimulateIter<'a, D> {
    state: SimulateIterState<'a, D>,
    sim: &'a Simulation,
}

enum SimulateIterState<'a, D> {
    Initial(&'a Vector<D>),
    Generating(Vector<D>),
    Done,
}

impl<'a, D> Iterator for SimulateIter<'a, D>
where
    D: MultiPhotonDims + MultiPhotonInteract<SinglePhotonDims, SinglePhotonDims, D>,
    Vector<D>: core::fmt::Debug,
{
    type Item = Vector<D>;
    fn next(&mut self) -> Option<Self::Item> {
        loop {
            match &self.state {
                SimulateIterState::Done => return None,
                SimulateIterState::Initial(vec) => {
                    let next_vec = self.sim.propagate_and_interact(vec);
                    self.state = if next_vec.norm_squared() < 1e-6 {
                        SimulateIterState::Done
                    } else {
                        SimulateIterState::Generating(next_vec)
                    };
                }
                SimulateIterState::Generating(vec) => {
                    let next_vec = self.sim.propagate_and_interact(vec);
                    let new_state = if next_vec.norm_squared() < 1e-6 {
                        SimulateIterState::Done
                    } else {
                        SimulateIterState::Generating(next_vec)
                    };
                    if let SimulateIterState::Generating(vec) =
                        core::mem::replace(&mut self.state, new_state)
                    {
                        return Some(vec);
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
            hlist![$(PosX($x), PosY($y), expand_dir!($dir), Polarization::$pol),+]
        };
    }

    macro_rules! photon {
        ($($($st:tt),*)|+) => {
            vector![state![$($($st),*)|+] => Complex::ONE]
        };
    }

    #[test]
    fn should_operate_on_single_photon() {
        let simulation = sim_with_elem(Element::Mirror(Angle::UpLeft));
        let one_photon = photon![0, 2, >, H];
        let mut sim = simulation.simulate(&one_photon);

        let frame1 = photon![1, 2, >, H];
        let frame2 = photon![2, 2, ^, H];
        let frame3 = photon![2, 1, ^, H];
        let frame4 = photon![2, 0, ^, H];

        assert_eq!(sim.next(), Some(frame1));
        assert_eq!(sim.next(), Some(frame2));
        assert_eq!(sim.next(), Some(frame3));
        assert_eq!(sim.next(), Some(frame4));
        assert_eq!(sim.next(), None);
    }

    #[test]
    fn should_operate_on_two_photons() {
        let simulation = Simulation::new(&Grid {
            width: 5,
            height: 5,
            elements: map![Coord::new(2, 2) => Element::Mirror(Angle::UpLeft)],
        });

        let two_photons = photon![1, 2, >, H | 2, 4, ^, V];

        let mut sim = simulation.simulate(&two_photons);
        assert_eq!(sim.next(), Some(photon![2, 2, ^, H | 2, 3, ^, V]));
        assert_eq!(sim.next(), Some(-photon![2, 1, ^, H | 2, 2, >, V]));
        assert_eq!(sim.next(), Some(-photon![2, 0, ^, H | 3, 2, >, V]));
    }
}
