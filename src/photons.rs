use std::collections::HashMap;

mod dimensions;
mod elements;

pub use dimensions::*;
pub use elements::*;

struct Grid {
    width: u16,
    height: u16,
    elements: HashMap<(u16, u16), Element>,
}

impl Grid {}
