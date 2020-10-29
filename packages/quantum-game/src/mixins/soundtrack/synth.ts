/* eslint-disable @typescript-eslint/no-explicit-any */

import * as Tone from 'tone'
import { BarsBeatsSixteenths } from 'tone/build/esm/core/type/Units'

interface ITransportPosition {
  bars: number
  beats: number
  quarters: number
}

export class Synth {
  scales = [
    [0, 2, 4, 5, 7, 9, 11], // major
    [0, 2, 3, 5, 7, 8, 10], // minor
    [0, 2, 5, 7, 9], // penta
    [0, 2, 4, 6, 10], // dim
  ]

  currentScale = 1
  transpositions = [-12, -10, -8, -6]
  transpose = this.transpositions[0]

  limiter = new Tone.Limiter({ threshold: -2 })
  gain = new Tone.Gain()
  hip1 = new Tone.Filter(1000, 'highpass')
  feedbackDelay = new Tone.FeedbackDelay('8n', 0.7)
  chorus = new Tone.Chorus(4, 2.5, 0.5)
  pingPongDelay = new Tone.PingPongDelay('4n', 0.2)
  synth1 = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'sine3' },
    envelope: { attack: 0.2, decay: 0.6, sustain: 0.3, release: 1.1 },
  })

  synth2Freeverb = new Tone.Freeverb({
    roomSize: 0.97,
    dampening: 500,
  })

  synth2 = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'sine' },
    envelope: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 0.3 },
  })

  synth3 = new Tone.AMSynth({
    harmonicity: 0.5,
    oscillator: {
      type: 'amsine2',
      modulationType: 'sine',
      harmonicity: 1.0,
    },
    envelope: {
      attack: 0.406,
      decay: 1,
      sustain: 0.34,
      release: 1.2,
    },
    modulation: {
      volume: 2,
      type: 'amsine',
      modulationType: 'triangle',
      harmonicity: 2,
    },
    modulationEnvelope: {
      attack: 0.006,
      decay: 0.2,
      sustain: 0.2,
      release: 0.4,
    },
  })

  synth4 = new Tone.AMSynth({
    harmonicity: 0.5,
    oscillator: {
      type: 'amsine2',
      modulationType: 'sine3',
      harmonicity: 1.5,
    },
    envelope: {
      attack: 0.206,
      decay: 0.3,
      sustain: 0.34,
      release: 2.2,
    },
    modulation: {
      volume: 2,
      type: 'amsine3',
      modulationType: 'sine4',
      harmonicity: 2,
    },
    modulationEnvelope: {
      attack: 0.2,
      decay: 0.2,
      sustain: 0.2,
      release: 1.4,
    },
  })

  synth1GhostNoteTriggeredFlag = false
  synth2GhostNoteTriggeredFlag = false
  synth3GhostNoteTriggeredFlag = false
  synth4GhostNoteTriggeredFlag = false
  useSynth1Flag = true
  useSynth2Flag = true
  useSynth3Flag = true
  useSynth4Flag = true
  currentTransportPosition: ITransportPosition = {
    bars: 0,
    beats: 0,
    quarters: 0,
  }

  log: any

  constructor(logging = false) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.log = logging ? console.log : (): void => {}

    this.limiter.toDestination()
    this.gain.connect(this.limiter)
    this.hip1.connect(this.gain)
    this.feedbackDelay.connect(this.hip1)
    this.chorus.connect(this.hip1)
    this.pingPongDelay.connect(this.hip1)
    this.synth1.connect(this.feedbackDelay)
    this.synth1.connect(this.pingPongDelay)
    this.synth2.connect(this.chorus)
    this.synth2.connect(this.synth2Freeverb)
    this.synth2Freeverb.connect(this.hip1)
    this.synth3.connect(this.gain)
    this.synth4.connect(this.feedbackDelay)
    this.synth4.connect(this.pingPongDelay)
    this.synth2.volume.value = -19
    this.synth3.volume.value = -1
    this.synth4.volume.value = -3

    Tone.Transport.scheduleRepeat(() => this.onEveryquarter(), '16n')
    Tone.Transport.start()
  }

  setOverallVolume(volume: number): void {
    this.gain.gain.rampTo(volume, 0.1)
  }

  /**
   * Set all generative tracks on/off
   * @param status
   */
  setAllGenerative(status: boolean): void {
    this.useSynth1Flag = status
    this.useSynth2Flag = status
    this.useSynth3Flag = status
    this.useSynth4Flag = status
  }

  /**
   * Seems to generate random chords
   * @param numNotes
   * @param min
   * @param max
   */
  randomChord(numNotes: number, min = 0, max = 0): number[] {
    const result: number[] = []
    numNotes = Math.abs(Math.floor(numNotes))
    let iter = 0
    while (iter < 100 && result.length < numNotes) {
      const note = this.randomNoteInScale(min, max)
      if (!result.includes(note)) {
        result.push(note)
      }
      iter += 1
    }
    return result
  }

  /**
   * Seems to generate a random note
   * @param min
   * @param max
   */
  randomNoteInScale(min = 0, max = 0): number {
    const scale = this.scales[this.currentScale].map((s) => (s + this.transpose + 12) % 12)
    const possibleNotes = []
    for (let i = min; i <= max; i++) {
      if (scale.includes(i % 12)) {
        possibleNotes.push(i)
      }
    }
    if (possibleNotes.length === 0) return min
    const idx = Math.floor(Math.random() * possibleNotes.length)
    return possibleNotes[idx]
  }

  onEveryquarter(): void {
    const nowPos = parseTransportPosition(Tone.Transport.position as BarsBeatsSixteenths)
    const prevPos = this.currentTransportPosition
    this.currentTransportPosition = nowPos

    const barChanged = prevPos.bars !== nowPos.bars
    const quarterChanged = prevPos.quarters !== nowPos.quarters
    const barEven = nowPos.bars % 2 === 0
    const barOdd = nowPos.bars % 2 === 1

    // ****************************** scale ****************************** \\
    if (barChanged && barEven && Math.random() > 0.8) {
      const tempScale = Math.floor(Math.random() * this.scales.length)
      this.currentScale = tempScale
      this.log('scale = ' + tempScale)
    }
    // **************************** transpose **************************** \\
    if (barChanged && barEven && Math.random() > 0.8) {
      const tempTranspose = Math.floor(Math.random() * this.transpositions.length)
      this.transpose = this.transpositions[tempTranspose]
      this.log('transpose = ' + tempTranspose)
    }
    // ***************************** synth 1 ***************************** \\
    if (this.useSynth1Flag) {
      if (barChanged && barEven && (Math.random() > 0.6 || this.synth1GhostNoteTriggeredFlag)) {
        this.synth1GhostNoteTriggeredFlag = false
        this.randomChord(4, 40, 60).forEach((note) => {
          this.synth1.triggerAttackRelease(mtof(note), '1n')
        })
      }
      if (
        quarterChanged &&
        barOdd &&
        nowPos.beats === 0 &&
        nowPos.quarters === 3 &&
        Math.random() > 0.7
      ) {
        this.synth1GhostNoteTriggeredFlag = true
        this.randomChord(3, 40, 60).forEach((note) => {
          this.synth1.triggerAttackRelease(mtof(note), '1n')
        })
      }
    }

    // ***************************** synth 2 ***************************** \\
    if (this.useSynth2Flag) {
      if (barChanged && barOdd && (Math.random() > 0.7 || this.synth2GhostNoteTriggeredFlag)) {
        this.synth2GhostNoteTriggeredFlag = false
        this.synth2.triggerAttackRelease(mtof(this.randomNoteInScale(56, 90)), '16n')
      }
      if (
        quarterChanged &&
        barEven &&
        nowPos.beats === 0 &&
        nowPos.quarters === 3 &&
        Math.random() > 0.7
      ) {
        this.synth2GhostNoteTriggeredFlag = true
        this.synth2.triggerAttackRelease(mtof(this.randomNoteInScale(56, 90)), '16n')
      }
    }

    // ***************************** synth 3 ***************************** \\
    if (this.useSynth3Flag) {
      if (barChanged && barEven && (Math.random() > 0.5 || this.synth3GhostNoteTriggeredFlag)) {
        this.synth3GhostNoteTriggeredFlag = false
        this.synth3.triggerAttackRelease(mtof(this.randomNoteInScale(30, 48)), '1n')
        // mtof(this.randomNoteInScale(60, 96))
      }
      if (
        quarterChanged &&
        nowPos.quarters === 2 &&
        (Math.random() > 0.5 || this.synth3GhostNoteTriggeredFlag)
      ) {
        this.synth3GhostNoteTriggeredFlag = false
        this.synth3.triggerAttackRelease(mtof(this.randomNoteInScale(30, 48)), '2n')
        // mtof(this.randomNoteInScale(60, 96))
      }
    }

    // ***************************** synth 4 ***************************** \\
    if (this.useSynth4Flag) {
      if (
        barChanged &&
        nowPos.bars % 4 === 0 &&
        (Math.random() > 0.0 || this.synth4GhostNoteTriggeredFlag)
      ) {
        this.synth4GhostNoteTriggeredFlag = false
        this.synth4.triggerAttackRelease(mtof(this.randomNoteInScale(26, 46)), '1m')
        // mtof(this.randomNoteInScale(60, 96))
      }
    }
  }
}

/**
 * Parse transport string to transportPosition
 * @param rawTransportData
 */
function parseTransportPosition(rawTransportData: string): ITransportPosition {
  const [bars, beats, quarters] = rawTransportData.split(':')
  return {
    bars: +bars,
    beats: +beats,
    quarters: Math.floor(+quarters),
  }
}

/**
 * Returns a midi note frequency
 * @param midiNote
 */
function mtof(midiNote: number): number {
  return 440 * Math.pow(2, (midiNote - 69) / 12)
}
