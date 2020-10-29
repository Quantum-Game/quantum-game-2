use crate::{enum_dimension, PartialOperator};
use alloc::boxed::Box;
use wasm_bindgen::prelude::*;

pub use crate::{dimensions::Polarization, Operator};

pub(crate) type DimPol = Hlist![Polarization];
pub(crate) type DimDir = Hlist![Direction];
pub(crate) type DimDirPol = Hlist![Direction, Polarization];

pub(crate) const H: Hlist![Polarization] = hlist![Polarization::H];
pub(crate) const V: Hlist![Polarization] = hlist![Polarization::V];
pub(crate) const UP: Hlist![Direction] = hlist![Direction::Up];
pub(crate) const RIGHT: Hlist![Direction] = hlist![Direction::Right];
pub(crate) const DOWN: Hlist![Direction] = hlist![Direction::Down];
pub(crate) const LEFT: Hlist![Direction] = hlist![Direction::Left];

pub type SinglePhotonDims = Hlist![Coord, Direction, Polarization];
pub type SinglePhotonOperator = Box<dyn PartialOperator<SinglePhotonDims>>;

// #[derive(Debug, Clone, Copy, Eq, PartialEq, Hash)]
// pub struct PosX(pub u16);

// #[derive(Debug, Clone, Copy, Eq, PartialEq, Hash)]
// pub struct PosY(pub u16);

#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct Coord {
    pub x: u16,
    pub y: u16,
}

#[wasm_bindgen]
impl Coord {
    pub fn new(x: u16, y: u16) -> Coord {
        Coord { x, y }
    }
}

impl Coord {
    pub fn as_indicator(&self) -> Operator<Hlist![Coord]> {
        Operator::indicator(hlist![*self])
    }
}

enum_dimension! {
    #[wasm_bindgen]
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
