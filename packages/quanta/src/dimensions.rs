/// This module provides some built-in dimension types, but there is nothing
/// special about them, and user should be able to implement one themelves.
///
/// All dimension types must implement `Debug, Clone, Copy, Eq, PartialEq, Hash`.
/// Implement `Enumerable` for automatic creation of indentity operators over given dimension.
///
/// For enums, use `enum_dimension!` macro to auto-derive all of the above.
use crate::enum_dimension;
use wasm_bindgen::prelude::*;

enum_dimension! {
    #[wasm_bindgen]
    pub enum Polarization {
        H,
        V,
    }
}

enum_dimension! {
    #[wasm_bindgen]
    pub enum Spin {
        U,
        D,
    }
}

#[wasm_bindgen]
#[derive(Debug, Clone, Copy, Eq, PartialEq, Hash)]
pub struct PositionX(pub u32);

#[wasm_bindgen]
#[derive(Debug, Clone, Copy, Eq, PartialEq, Hash)]
pub struct PositionY(pub u32);
