# 50-50 Beamsplitter

Optical devices used to split a single beam of laser light into two beams, or to recombine two beams into one.

```{quantum-board}
{
  "cols": 4,
  "rows": 3,
  "cells": [
    {
      "coord": { "y": 0, "x": 0 },
      "element": "Laser",
      "rotation": 0,
      "frozen": true,
      "active": true
    },
    {
      "coord": { "y": 0, "x": 2 },
      "element": "BeamSplitter",
      "rotation": 135,
      "frozen": false,
      "active": false
    }
  ]
}
```


```{quantum-board}
{
  "cols": 4,
  "rows": 3,
  "cells": [
    {
      "coord": { "y": 0, "x": 0 },
      "element": "Laser",
      "rotation": 0,
      "frozen": true,
      "active": true,
      "energized": false
    },
    {
      "coord": { "y": 0, "x": 2 },
      "element": "BeamSplitter",
      "rotation": 90,
      "frozen": false,
      "active": false,
      "energized": false
    }
  ]
}
```

## The basics

Beamsplitters are optical devices used to split a single beam of laser light into two beams, independent of the polarization of the incoming light. If the two outgoing beams have the same intensity, it is called a 50-50 beamsplitter. This ratio between the two beams intensity can be tuned arbitrarily to obtain more light transmitted than reflected or vice versa. Beamsplitters can also be used in reverse, to recombine two beams into one!

## Everday use

Beamsplitters can come in two forms: a cube or a thin slab (like shown in the figure above).

**Beamsplitters cubes** are made of two prisms glued to each other. Using a phenomenon called [frustrated total internal reflection](https://en.wikipedia.org/wiki/Total_internal_reflection#Frustrated_total_internal_reflection) half of the initial beam is reflected, the other half is transmitted. This ratio depends on the gap between the two prisms, which is chosen and manufactured extremely carefully.

## Explanation

You can experiment with frustrated total internal reflection yourself by filling a glass with water. If you look down into your glass of water, you will notice that you can’t see the “outside world” at all through the sides of the glass. This is because all the light gets reflected inside the glass of water, none is transmitted to the outside. However, if you hold the glass with your fingers, by holding it tightly you will see your fingerprints appearing

Beamsplitters are used in interferometers, and some spooky phenomenon can be achieved with them (check out level xx)! This phenomenon is due to a phase shift which the beamsplitter imparts on the reflected beam. When light bounces off a material with a higher refractive index, it picks up a phase of 180°, or a π-phase.

## Usage in laboratories and experiments

You can find beamsplitters around you in your everyday life! For example, they used to be inside old TVs. Nowadays, they are used in CCD-cameras, LCD displays and optical fibre communication systems. Of course, they are used daily by thousands of scientists in the world, which align them as part of their large optical systems.

## Further resources

Beamsplitters are a fundamental optical element in all optics and quantum physics labs. They are commonly used to create more beams from a single incoming beam, such that the two outgoing beams can be recombined later after one of them has undergone further manipulation. Some common setups which embed beamsplitters are:

* Michelson-Morley interferometers
* Mach-Zehnder interferometers

![Beamsplitter](https://upload.wikimedia.org/wikipedia/commons/1/1f/Beamsplitter-1.png)

Famous experiments that used beamsplitters are:

* The Fizeau experiment of 1851 to measure the speeds of light in water
* The Michelson-Morley experiment of 1887 to measure the effect of the (hypothetical) luminiferous aether on the speed of light
* Bell test experiments (from ca. 1972) to demonstrate consequences of quantum entanglement and exclude local hidden variable theories
* Wheeler's delayed choice experiment of 1978, 1984 etc., to test what makes a photon behave as a wave or a particle and when it happens

## Further reading

* [What are Beamsplitters?](https://www.edmundoptics.com/resources/application-notes/optics/what-are-beamsplitters/)
* [Beamsplitters on Wikipedia](https://en.wikipedia.org/wiki/Beam_splitter)
* [Beamsplitters on RP Photonics Encyclopedia](https://www.rp-photonics.com/beam_splitters.html)

Videos on hommade beamsplitters:

* [What is a beam splitter and how do you make one?](https://www.youtube.com/watch?v=P1n3hizj3c4)
* [Playing with beamsplitters](Playing with beamsplitters)