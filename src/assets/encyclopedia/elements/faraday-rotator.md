# Faraday Rotator

It rotates the polarization of light by 45 degrees due to interaction with magnetic crystal.

```{quantum-board}
      {
        "cols": 4,
        "rows": 3,
        "cells": [
          {
            "coord": { "y": 1, "x": 0 },
            "element": "Laser",
            "rotation": 0,
            "frozen": true,
            "active": true
          },
          {
            "coord": { "y": 1, "x": 2 },
            "element": "FaradayRotator",
            "rotation": 90,
            "frozen": false,
            "active": false
          }
        ]
      }
```

## The basics

A photon enters a ferromagnetic crystal placed in a strong magnetic field. Due to “magneto-optic effect”, the polarization of the photon is rotated by an angle proportional to the magnetic field along the propagation direction. Consequently, if the photon enters from the opposite end, its polarization will be rotated in the opposite direction.

## Explanations

Suppose a photon travels through a faraday rotator, gets reflected off the mirror and travels back through the rotator. On the second pass, the effect of the rotator adds up to the first pass, and the photon polarization is rotated by 90 degrees overall. The reason for this is that upon reflection, the wave changes chirality - so left-circularly polarized light becomes right-circularly polarized, and vice versa. This so-called “non-reciprocity” is the reason why Faraday rotators are ubiquitous in optics laboratories.

## USAGE IN LABORATORIES AND EXPERIMENTS

By combining a Faraday rotator with two polarizing beamsplitters we create an optical isolator. This device allows light to pass in one direction, while blocking the other. Isolators are commonly used to protect sensitive equipment (such as laser diodes) that can break due to back-reflections. Faraday rotators can also be used to create double-pass amplifiers.

## Further Reading

* [Magneto-optic Effects](https://en.wikipedia.org/wiki/Magneto-optic_effect)
* [Faraday Rotators](https://www.rp-photonics.com/faraday_rotators.html)
* [Faraday Rotators on ThorLabs](https://www.thorlabs.com/newgrouppage9.cfm?objectgroup_id=12684)