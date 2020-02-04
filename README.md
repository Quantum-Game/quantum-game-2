# Quantum Game 2

A puzzle game with photons, superposition and quantum measurement, right in your browser. With true quantum mechanics underneath!

![GitHub package.json version](https://img.shields.io/github/package-json/v/Quantum-Game/quantum-game-2)
![License](https://img.shields.io/github/license/Quantum-Game/quantum-game-2)
[![Build Status](https://travis-ci.com/Quantum-Game/quantum-game-2.svg?branch=master)](https://travis-ci.com/Quantum-Game/quantum-game-2)
[![Twitter @QuantumGameIO](https://img.shields.io/twitter/follow/QuantumGameIO)](https://twitter.com/quantumgameio)

Follow updates on Twitter [@QuantumGameIO](https://twitter.com/QuantumGameIO), [Faceboook](https://www.facebook.com/quantumgameio/) and read our blog posts on [Medium](https://medium.com/quantum-photons).

Quantum Game is currently being developed by dr [Piotr Migdał](https://p.migdal.pl/), [Philippe Cochin](https://github.com/sneakyweasel), [Chiara Decaroli](https://maperseguirvirtute.wordpress.com/), [Klem Jankiewicz](http://jankiewiczstudio.com/), [Kuba Strebeyko](https://www.linkedin.com/in/strebeyko/) and others.

This version of the game was funded by the [Center for Quantum Technologies of the National University of Singapore](https://www.quantumlah.org/).

The current version uses [Quantum Tensors](https://github.com/Quantum-Game/quantum-tensors) - a JavaScript / TypeScript package for sparse tensor operations on complex numbers. It is a NPM package we created for this game, but made it in a way it is reusable.

You can play the old version (2014-2016) [here](http://play.quantumgame.io/); its source is at [stared/quantum-game](https://github.com/stared/quantum-game).

[![Centre for Quantum Technologies - National University of Singapore](https://img.shields.io/badge/Supported%20By-CQT,%20National%20University%20of%20Singapore-brightgreen.svg?style=for-the-badge)](https://www.quantumlah.org/)

## Installation

You need to have [yarn](https://yarnpkg.com/) installed. Then, after cloning install dependecies with:

```bash
yarn
```

And run it with:

```bash
yarn serve
```

## Conventions

- Rotation start right and go counter-clockwise (Complex number style).
- Position start at [0, 0] located in top left cell.
- Percentage are float until displayed. (toPercentString in engine/helpers)
- All CSS is scoped.
