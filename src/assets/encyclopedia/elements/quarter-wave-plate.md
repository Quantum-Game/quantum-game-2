# Quarter Wave Plate

Quarter wave plates delay the polarization by lambda/4. This means that they convert linearly polarized light into circularly polarized light and vice versa.

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
            "element": "QuarterWavePlate",
            "rotation": 135,
            "frozen": false,
            "active": false
          }
        ]
      }
```

## The basics

![Quarter Plate](https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Circular.Polarization.Circularly.Polarized.Light_Circular.Polarizer_Creating.Left.Handed.Helix.View.svg/1280px-Circular.Polarization.Circularly.Polarized.Light_Circular.Polarizer_Creating.Left.Handed.Helix.View.svg.png)

Waveplates are thick slabs of birefringent material, such as quartz or mica. For this type of material, the index of refraction, which is a quantity related to how fast or slow light is travelling through a medium, is different along two main directions within the crystal. When light is linearly polarized, this polarization can be broken into two components along the directions of the birefringence. Due to the different refractive index, one of the components will travel slower than the other. The phase shift between them is of pi/2. This phase shift between components gives rise to elliptical and circular polarization.

## Everyday use & usage in laboratories

Waveplates are widely used as a tool to identify minerals. Of course, something you’d want to do everyday. They are also used to determine the sugar content of beer!
They are also used extensively in optics and quantum physics laboratories, where light with very specific polarization states is required.

## Digging deeper

The two axis of the crystalline birefringent material are called the fast and slow axis. Manufacturing these plates is extremely challenging. The plate must be cut at exactly the right thickness to achieve the desired delay, and the tolerance for this is very tight, there is no room for error!

## Further Reading

[Wave Plate on Wikipedia](https://en.wikipedia.org/wiki/Waveplate)
[Introduction to Waveplates](https://www.toweroptical.com/introduction-to-waveplates/)
[Understanding Waveplates](https://www.edmundoptics.com/resources/application-notes/optics/understanding-waveplates/)
[More on Waveplates](https://www.rp-photonics.com/waveplates.html)
