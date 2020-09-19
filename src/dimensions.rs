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
