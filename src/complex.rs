use approx::{AbsDiffEq, UlpsEq};
use std::f32::consts::PI;
use std::ops::{Add, AddAssign, Div, DivAssign, Mul, MulAssign, Neg, Sub, SubAssign};
const TAU: f32 = 2.0 * PI;

#[derive(Clone, Copy, PartialEq, Default)]
pub struct Complex {
    pub re: f32,
    pub im: f32,
}

/// Alias for Complex::new
pub const fn cx(re: f32, im: f32) -> Complex {
    Complex::new(re, im)
}

pub struct DisplayPolar(Complex);
pub struct DisplayPolarTau(Complex);

impl std::fmt::Debug for Complex {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_tuple("Cx").field(&self.re).field(&self.im).finish()
    }
}

impl std::fmt::Display for Complex {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let p = f.precision().unwrap_or(2);
        write!(f, "({:.*} {:+.*}i)", p, self.re, p, self.im)
    }
}

impl std::fmt::Display for DisplayPolar {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let p = f.precision().unwrap_or(2);
        write!(f, "{:.*} exp({:.*}i)", p, self.0.abs(), p, self.0.arg())
    }
}

impl std::fmt::Display for DisplayPolarTau {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let p = f.precision().unwrap_or(2);
        let abs = self.0.abs();
        let phi = self.0.phi_tau();
        write!(f, "{:.*} exp({:.*}τi)", p, abs, p, phi)
    }
}

impl From<[f32; 2]> for Complex {
    fn from(values: [f32; 2]) -> Self {
        Complex::new(values[0], values[1])
    }
}

impl From<(f32, f32)> for Complex {
    fn from((re, im): (f32, f32)) -> Self {
        Complex::new(re, im)
    }
}

impl Complex {
    pub const ZERO: Complex = Complex { re: 0.0, im: 0.0 };
    pub const ONE: Complex = Complex { re: 1.0, im: 0.0 };

    /// Create a complex number from cartesian coordinates
    pub const fn new(re: f32, im: f32) -> Self {
        Self { re, im }
    }

    /// Create a complex number from polar coordinates
    pub fn from_polar(r: f32, phi: f32) -> Complex {
        Complex::new(r * phi.cos(), r * phi.sin())
    }

    /// Length squared: intensity probability
    pub fn abs2(&self) -> f32 {
        return self.re * self.re + self.im * self.im;
    }

    /// Absolute value (length)
    pub fn abs(&self) -> f32 {
        self.abs2().sqrt()
    }

    /// Display in polar coordinates
    pub const fn display_polar(&self) -> DisplayPolar {
        DisplayPolar(*self)
    }

    /// Display in polar-tau coordinates
    pub const fn display_polar_tau(&self) -> DisplayPolarTau {
        DisplayPolarTau(*self)
    }

    pub fn almost_zero(&self) -> bool {
        self.abs2() < 1e-12
    }

    /// Complex number argument in range [0,Tau]
    pub fn arg(&self) -> f32 {
        let arg = f32::atan2(self.im, self.re);
        if arg < 0.0 {
            arg + TAU
        } else {
            arg
        }
    }

    /// Phi angle in polar coordinate with TAU
    /// arg divided by TAU
    pub fn phi_tau(&self) -> f32 {
        self.arg() / TAU
    }

    /// Complex conjugation
    /// `z = z{re, -im}`
    pub fn conj(&self) -> Complex {
        Complex::new(self.re, -self.im)
    }

    /// Get a complex with same argument and norm one
    pub fn normalized(&self) -> Complex {
        let norm = self.abs();
        Complex::new(self.re / norm, self.im / norm)
    }
}

impl AddAssign for Complex {
    fn add_assign(&mut self, rhs: Complex) {
        self.re += rhs.re;
        self.im += rhs.im;
    }
}

impl Add for Complex {
    type Output = Complex;
    fn add(mut self, rhs: Complex) -> Complex {
        self += rhs;
        self
    }
}

impl SubAssign for Complex {
    fn sub_assign(&mut self, rhs: Complex) {
        self.re -= rhs.re;
        self.im -= rhs.im;
    }
}

impl Sub for Complex {
    type Output = Complex;
    fn sub(mut self, rhs: Complex) -> Complex {
        self -= rhs;
        self
    }
}

impl MulAssign for Complex {
    fn mul_assign(&mut self, rhs: Complex) {
        let Complex { im, re } = *self;
        self.re = re * rhs.re - im * rhs.im;
        self.im = re * rhs.im + im * rhs.re;
    }
}

impl MulAssign<f32> for Complex {
    fn mul_assign(&mut self, rhs: f32) {
        self.re *= rhs;
        self.im *= rhs;
    }
}

impl Mul for Complex {
    type Output = Complex;
    fn mul(mut self, rhs: Complex) -> Complex {
        self *= rhs;
        self
    }
}

impl Mul<f32> for Complex {
    type Output = Complex;
    fn mul(mut self, rhs: f32) -> Complex {
        self *= rhs;
        self
    }
}

impl Add for &Complex {
    type Output = Complex;
    fn add(self, rhs: &Complex) -> Complex {
        *self + *rhs
    }
}

impl Mul for &Complex {
    type Output = Complex;
    fn mul(self, rhs: &Complex) -> Complex {
        *self * *rhs
    }
}

impl Neg for Complex {
    type Output = Complex;
    fn neg(self) -> Self::Output {
        Complex::new(-self.re, -self.im)
    }
}

impl Neg for &Complex {
    type Output = Complex;
    fn neg(self) -> Self::Output {
        Complex::new(-self.re, -self.im)
    }
}

impl DivAssign for Complex {
    fn div_assign(&mut self, rhs: Complex) {
        let Complex { im, re } = *self;
        let denom = rhs.im * rhs.im + rhs.re * rhs.re;
        self.re = (re * rhs.re + im * rhs.im) / denom;
        self.im = (rhs.re * im - re * rhs.im) / denom;
    }
}

impl Div for Complex {
    type Output = Complex;
    fn div(mut self, rhs: Complex) -> Complex {
        self /= rhs;
        self
    }
}

impl std::iter::Sum for Complex {
    fn sum<I: Iterator<Item = Self>>(iter: I) -> Self {
        iter.fold(Complex::ZERO, Add::add)
    }
}

impl AbsDiffEq for Complex {
    type Epsilon = f32;
    fn default_epsilon() -> Self::Epsilon {
        f32::default_epsilon()
    }
    fn abs_diff_eq(&self, other: &Self, epsilon: Self::Epsilon) -> bool {
        self.re.abs_diff_eq(&other.re, epsilon) && self.im.abs_diff_eq(&other.im, epsilon)
    }
    fn abs_diff_ne(&self, other: &Self, epsilon: Self::Epsilon) -> bool {
        self.re.abs_diff_ne(&other.re, epsilon) || self.im.abs_diff_ne(&other.im, epsilon)
    }
}

impl UlpsEq for Complex {
    fn default_max_ulps() -> u32 {
        f32::default_max_ulps()
    }
    fn ulps_eq(&self, other: &Self, epsilon: Self::Epsilon, max_ulps: u32) -> bool {
        self.re.ulps_eq(&other.re, epsilon, max_ulps)
            && self.im.ulps_eq(&other.im, epsilon, max_ulps)
    }
    fn ulps_ne(&self, other: &Self, epsilon: Self::Epsilon, max_ulps: u32) -> bool {
        self.re.ulps_ne(&other.re, epsilon, max_ulps)
            || self.im.ulps_ne(&other.im, epsilon, max_ulps)
    }
}

#[cfg(test)]
mod tests {
    use super::{cx, Complex};
    use approx::{assert_ulps_eq, ulps_eq};
    use std::f32::consts::PI;

    #[test]
    fn should_create_a_complex_element_from_two_numbers() {
        let z = cx(4.0, -4.0);
        assert_ne!(z, Complex::ZERO);
        assert_eq!(format!("{}", z), "(4.00 -4.00i)");
    }

    #[test]
    fn should_return_the_complex_conjugate_of_a_complex_number() {
        let z1 = cx(4.0, -4.0);
        let z2 = cx(3.0, 0.0);
        let conj1 = z1.conj();
        let conj2 = z2.conj();

        assert_ne!(conj1, Complex::ZERO);
        assert_ne!(conj2, Complex::ZERO);
        assert_eq!(format!("{}", conj1), "(4.00 +4.00i)");
        assert_eq!(format!("{}", conj2), "(3.00 +0.00i)");
    }

    #[test]
    fn should_test_if_a_complex_number_is_zero() {
        let z1 = cx(0.0, 0.0);
        let z2 = cx(0.0, 1.0);
        assert_eq!(z1, Complex::ZERO);
        assert_ne!(z2, Complex::ZERO);
    }

    #[test]
    fn should_give_non_negative_arg() {
        let z1 = cx(1.0, -1.0);
        let z2 = cx(0.0, -1.0);
        assert_ulps_eq!(z1.arg(), 1.75 * PI);
        assert_ulps_eq!(z2.arg(), 1.5 * PI);
    }

    #[test]
    fn should_give_phase_in_tau() {
        let z1 = cx(1.0, -1.0);
        let z2 = cx(-1.0, 0.0);
        let z3 = cx(0.0, -1.0);
        assert_ulps_eq!(z1.phi_tau(), 0.875);
        assert_ulps_eq!(z2.phi_tau(), 0.5);
        assert_ulps_eq!(z3.phi_tau(), 0.75);
    }

    #[test]
    fn should_add_two_complex_numbers() {
        let z1 = cx(4.0, -1.0);
        let z2 = cx(2.0, 3.0);
        assert_ulps_eq!(z1 + z2, cx(6.0, 2.0));
        assert_ulps_eq!(z2 + z1, cx(6.0, 2.0));
    }

    #[test]
    fn should_subtract_two_complex_numbers() {
        let z1 = cx(4.0, -1.0);
        let z2 = cx(2.0, 3.0);
        assert_ulps_eq!(z1 - z2, cx(2.0, -4.0));
        assert_ulps_eq!(z2 - z1, cx(-2.0, 4.0));
    }

    #[test]
    fn should_multiply_two_complex_numbers() {
        let z1 = cx(3.0, 2.0);
        let z2 = cx(1.0, 7.0);
        assert_ulps_eq!(z1 * z2, cx(-11.0, 23.0));
        assert_ulps_eq!(z2 * z1, cx(-11.0, 23.0));
    }

    #[test]
    fn should_normalize() {
        let z = cx(3.0, 4.0);
        assert_ulps_eq!(z.normalized(), cx(0.6, 0.8))
    }

    #[test]
    fn should_create_a_complex_number_from_polar_coordinates() {
        let z = Complex::from_polar(2.0, 1.0);
        assert_ulps_eq!(z, cx(1.0806046117362795, 1.682941969615793));
        ulps_eq!(z.abs(), 2.0);
        ulps_eq!(z.arg(), 1.0);
    }

    #[test]
    fn should_divide_numbers() {
        let z1 = cx(10.0, -5.0);
        let z2 = cx(-3.0, 4.0);
        assert_ulps_eq!(z1 / z2, cx(-2.0, -1.0));
        assert_ulps_eq!(z2 / z1, cx(-0.4, 0.2));
    }

    #[test]
    fn should_print_complex_number() {
        let z = cx(1.0, -1.0);
        assert_eq!(format!("{}", z), "(1.00 -1.00i)");
        assert_eq!(format!("{}", z.display_polar()), "1.41 exp(5.50i)");
        assert_eq!(format!("{:.4}", z.display_polar()), "1.4142 exp(5.4978i)");
        assert_eq!(
            format!("{:.4}", z.display_polar_tau()),
            "1.4142 exp(0.8750τi)"
        );
    }

    // #[test]
    // fn should_generate_color_for_a_complex_number() {
    //     assert_eq!(Complex::from_polar(1.0, 0.0).to_color(), "#ff0000");
    //     assert_eq!(Complex::from_polar(1.0, 0.3333 * PI).to_color(), "#ffff00");
    //     assert_eq!(Complex::from_polar(1.0, 0.6666 * PI).to_color(), "#00ff00");
    // }
}
