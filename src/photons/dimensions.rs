use crate::{enum_dimension, PartialOperator};
use alloc::boxed::Box;

pub use crate::dimensions::Polarization;

pub(crate) type DimPol = Hlist![Polarization];
pub(crate) type DimDir = Hlist![Direction];
pub(crate) type DimDirPol = Hlist![Direction, Polarization];

pub(crate) const H: Hlist![Polarization] = hlist![Polarization::H];
pub(crate) const V: Hlist![Polarization] = hlist![Polarization::V];
pub(crate) const UP: Hlist![Direction] = hlist![Direction::Up];
pub(crate) const RIGHT: Hlist![Direction] = hlist![Direction::Right];
pub(crate) const DOWN: Hlist![Direction] = hlist![Direction::Down];
pub(crate) const LEFT: Hlist![Direction] = hlist![Direction::Left];

pub type SinglePhotonDims = Hlist![PosX, PosY, Direction, Polarization];
pub type SinglePhotonOperator = Box<dyn PartialOperator<SinglePhotonDims>>;

#[derive(Debug, Clone, Copy, Eq, PartialEq, Hash)]
pub struct PosX(pub u16);
#[derive(Debug, Clone, Copy, Eq, PartialEq, Hash)]
pub struct PosY(pub u16);

enum_dimension! {
    pub enum Direction {
        Right,
        Up,
        Left,
        Down,
    }
}

impl Direction {
    pub fn opposite(self) -> Self {
        match self {
            Direction::Right => Direction::Left,
            Direction::Up => Direction::Down,
            Direction::Left => Direction::Right,
            Direction::Down => Direction::Up,
        }
    }
}
