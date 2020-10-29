mod utils;

pub use utils::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
use js_sys::Array;
use quantum_tensors::{
    hlist, hlist_pat, Absorption, Angle, Complex, Coord, Direction, Element, Grid, Hlist,
    Polarization, Simulation, SinglePhotonDims, Vector,
};
use wasm_bindgen::{prelude::*, JsCast};
#[wasm_bindgen]
pub struct SimulationBuilder {
    grid: Grid,
    state: Vector<SinglePhotonDims>,
}

#[wasm_bindgen]
impl SimulationBuilder {
    pub fn new(width: u16, height: u16) -> Self {
        SimulationBuilder {
            grid: Grid {
                width,
                height,
                elements: Default::default(),
            },
            state: Vector::new(),
        }
    }

    fn with_elem(mut self, coord: Coord, element: Element) -> Self {
        self.grid.elements.insert(coord, element);
        self
    }

    // elements
    pub fn with_wall(self, coord: Coord) -> Self {
        self.with_elem(coord, Element::Wall)
    }
    pub fn with_gate(self, coord: Coord) -> Self {
        self.with_elem(coord, Element::Gate)
    }
    pub fn with_laser(self, coord: Coord, rotation: Direction) -> Self {
        self.with_elem(coord, Element::Laser(rotation))
    }
    pub fn with_non_linear_crystal(self, coord: Coord) -> Self {
        self.with_elem(coord, Element::NonLinearCrystal)
    }
    pub fn with_mirror(self, coord: Coord, rotation: Angle) -> Self {
        self.with_elem(coord, Element::Mirror(rotation))
    }
    pub fn with_beam_splitter(self, coord: Coord, rotation: Angle, split: f32) -> Self {
        self.with_elem(coord, Element::BeamSplitter(rotation, split))
    }
    pub fn with_polarizing_beam_splitter(self, coord: Coord, rotation: Angle) -> Self {
        self.with_elem(coord, Element::PolarizingBeamSplitter(rotation))
    }
    pub fn with_corner_cube(self, coord: Coord) -> Self {
        self.with_elem(coord, Element::CornerCube)
    }
    pub fn with_detector(self, coord: Coord, rotation: Direction) -> Self {
        self.with_elem(coord, Element::Detector(rotation))
    }
    pub fn with_rock(self, coord: Coord) -> Self {
        self.with_elem(coord, Element::Rock)
    }
    pub fn with_mine(self, coord: Coord) -> Self {
        self.with_elem(coord, Element::Mine)
    }
    pub fn with_absorber(self, coord: Coord, absorption: f32) -> Self {
        self.with_elem(coord, Element::Absorber(absorption))
    }
    pub fn with_detector_four(self, coord: Coord) -> Self {
        self.with_elem(coord, Element::DetectorFour)
    }
    pub fn with_polarizer(self, coord: Coord, rotation: Angle) -> Self {
        self.with_elem(coord, Element::Polarizer(rotation))
    }
    pub fn with_quarter_wave_plate(self, coord: Coord, rotation: Angle) -> Self {
        self.with_elem(coord, Element::QuarterWavePlate(rotation))
    }
    pub fn with_half_wave_plate(self, coord: Coord, rotation: Angle) -> Self {
        self.with_elem(coord, Element::HalfWavePlate(rotation))
    }
    pub fn with_sugar_solution(self, coord: Coord, pol_rotation: f32) -> Self {
        self.with_elem(coord, Element::SugarSolution(pol_rotation))
    }
    pub fn with_faraday_rotator(
        self,
        coord: Coord,
        rotation: Direction,
        pol_rotation: f32,
    ) -> Self {
        self.with_elem(coord, Element::FaradayRotator(rotation, pol_rotation))
    }
    pub fn with_glass(self, coord: Coord) -> Self {
        self.with_elem(coord, Element::Glass)
    }
    pub fn with_vacuum_jar(self, coord: Coord) -> Self {
        self.with_elem(coord, Element::VacuumJar)
    }

    pub fn with_entry(
        mut self,
        coord: Coord,
        dir: Direction,
        pol: Polarization,
        value: Complex,
    ) -> Self {
        self.state.insert(hlist![coord, dir, pol], value);
        self
    }

    pub fn simulate(self, max_frames: usize) -> FrameArray {
        Simulation::new(&self.grid)
            .simulate(&self.state)
            .take(max_frames)
            .map(|(vector, absorptions)| Frame {
                vector,
                absorptions,
            })
            .map(JsValue::from)
            .collect::<Array>()
            .unchecked_into::<FrameArray>()
    }
}

#[wasm_bindgen]
pub struct Frame {
    vector: Vector<SinglePhotonDims>,
    absorptions: Vec<Absorption>,
}

#[wasm_bindgen]
impl Frame {
    pub fn particles(&self) -> ParticleArray {
        self.vector
            .group_by_dims::<Hlist![Polarization], _>()
            .into_iter()
            .map(|(hlist_pat![coord, direction], pols)| Particle {
                coord,
                direction,
                a: pols.get(&hlist![Polarization::H]).unwrap_or(Complex::ZERO),
                b: pols.get(&hlist![Polarization::V]).unwrap_or(Complex::ZERO),
            })
            .map(JsValue::from)
            .collect::<Array>()
            .unchecked_into::<ParticleArray>()
    }

    pub fn entries(&self) -> PhotonEntries {
        let array = Array::new();
        for (hlist_pat![coord, d, p], value) in self.vector.values() {
            array.push(&Array::of4(
                &JsValue::from(*coord),
                &JsValue::from(*d as u32),
                &JsValue::from(*p as u32),
                &JsValue::from(value.clone()),
            ));
        }
        array.unchecked_into::<PhotonEntries>()
    }

    pub fn absorptions(&self) -> AbsorptionArray {
        self.absorptions
            .iter()
            .cloned()
            .map(JsValue::from)
            .collect::<Array>()
            .unchecked_into::<AbsorptionArray>()
    }
}

#[wasm_bindgen]
#[derive(Clone)]
pub struct Particle {
    pub coord: Coord,
    pub direction: Direction,
    pub a: Complex,
    pub b: Complex,
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "Array<Particle>")]
    pub type ParticleArray;

    #[wasm_bindgen(typescript_type = "Array<Frame>")]
    pub type FrameArray;

    #[wasm_bindgen(typescript_type = "Array<Absorption>")]
    pub type AbsorptionArray;

    #[wasm_bindgen(typescript_type = "Array<[Coord, Direction, Polarization, Complex]>")]
    pub type PhotonEntries;
}
