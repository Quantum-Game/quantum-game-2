/* eslint-disable */

// not yet working TS

import * as Tone from 'tone'

interface ITransportPosition {
  bars: number
  beats: number
  quarters: number
  ticks: number
}

export default class Soundtrack {
  latency_hint: string
  MIDI_NUM_NAMES: string[]
  samples: string[]
  scales: number[][]
  currentScale: number
  transpositions: number[]
  transpose: number
  limiter: any
  feedbackDelay: any
  pingPongDelay: any
  chorus: any
  hip1: any
  synth1: any
  synth2: any
  synth2_freeverb: any
  synth3: any
  synth4: any
  effectSamplers = []
  synth1_base_volume_factor: number
  synth2_base_volume_factor: number
  synth3_base_volume_factor: number
  synth4_base_volume_factor: number
  synth1_ghostNoteTriggeredFlag: boolean
  synth2_ghostNoteTriggeredFlag: boolean
  synth3_ghostNoteTriggeredFlag: boolean
  synth4_ghostNoteTriggeredFlag: boolean
  useSynth1Flag: boolean
  useSynth2Flag: boolean
  useSynth3Flag: boolean
  useSynth4Flag: boolean
  initializedFlag: boolean
  current_transport_position: ITransportPosition
  previous_transport_position: ITransportPosition
  // effectSamplers: any[]

  constructor() {
    this.latency_hint = 'interactive'
    this.MIDI_NUM_NAMES = [
      'C_1',
      'C#_1',
      'D_1',
      'D#_1',
      'E_1',
      'F_1',
      'F#_1',
      'G_1',
      'G#_1',
      'A_1',
      'A#_1',
      'B_1',
      'C0',
      'C#0',
      'D0',
      'D#0',
      'E0',
      'F0',
      'F#0',
      'G0',
      'G#0',
      'A0',
      'A#0',
      'B0',
      'C1',
      'C#1',
      'D1',
      'D#1',
      'E1',
      'F1',
      'F#1',
      'G1',
      'G#1',
      'A1',
      'A#1',
      'B1',
      'C2',
      'C#2',
      'D2',
      'D#2',
      'E2',
      'F2',
      'F#2',
      'G2',
      'G#2',
      'A2',
      'A#2',
      'B2',
      'C3',
      'C#3',
      'D3',
      'D#3',
      'E3',
      'F3',
      'F#3',
      'G3',
      'G#3',
      'A3',
      'A#3',
      'B3',
      'C4',
      'C#4',
      'D4',
      'D#4',
      'E4',
      'F4',
      'F#4',
      'G4',
      'G#4',
      'A4',
      'A#4',
      'B4',
      'C5',
      'C#5',
      'D5',
      'D#5',
      'E5',
      'F5',
      'F#5',
      'G5',
      'G#5',
      'A5',
      'A#5',
      'B5',
      'C6',
      'C#6',
      'D6',
      'D#6',
      'E6',
      'F6',
      'F#6',
      'G6',
      'G#6',
      'A6',
      'A#6',
      'B6',
      'C7',
      'C#7',
      'D7',
      'D#7',
      'E7',
      'F7',
      'F#7',
      'G7',
      'G#7',
      'A7',
      'A#7',
      'B7',
      'C8',
      'C#8',
      'D8',
      'D#8',
      'E8',
      'F8',
      'F#8',
      'G8',
      'G#8',
      'A8',
      'A#8',
      'B8',
      'C9',
      'C#9',
      'D9',
      'D#9',
      'E9',
      'F9',
      'F#9',
      'G9'
    ]
    this.samples = [
      /* 00 */ 'sfx/C2-MP3.mp3',
      /* 01 */ 'sfx/C4-MP3.mp3',
      /* 02 */ 'sfx/drumla4-MP3.mp3',
      /* 03 */ 'sfx/FlashBright_BWU228-MP3.mp3',
      /* 04 */ 'sfx/flt-MP3.mp3',
      /* 05 */ 'sfx/hit5-MP3.mp3',
      /* 06 */ 'sfx/hit7-MP3.mp3',
      /* 07 */ 'sfx/kiko1-MP3.mp3',
      /* 08 */ 'sfx/kura2_D-MP3.mp3',
      /* 09 */ 'sfx/kura2_D2-MP3.mp3',
      /* 10 */ 'sfx/kura3_G-MP3.mp3',
      /* 11 */ 'sfx/kura5_G-MP3.mp3',
      /* 12 */ 'sfx/kura8_D-MP3.mp3',
      /* 13 */ 'sfx/kura15_D-MP3.mp3',
      /* 14 */ 'sfx/Multimedia_BWU11275-MP3.mp3',
      /* 15 */ 'sfx/Multimedia_BWU112752-MP3.mp3',
      /* 16 */ 'sfx/noise1-MP3.mp3',
      /* 17 */ 'sfx/seq1-MP3.mp3',
      /* 18 */ 'sfx/seq2-MP3.mp3',
      /* 19 */ 'sfx/seq3-MP3.mp3',
      /* 20 */ 'sfx/sfx_sh1-MP3.mp3',
      /* 21 */ 'sfx/sfx_sh3-MP3.mp3',
      /* 22 */ 'sfx/ShotgunRackFast_ZA02492-MP3.mp3',
      /* 23 */ 'sfx/ShotgunRackFast_ZA024922-MP3.mp3',
      /* 24 */ 'sfx/stopa-MP3.mp3',
      /* 25 */ 'sfx/tape-MP3.mp3',
      /* 26 */ 'sfx/Track02-MP3.mp3',
      /* 27 */ 'sfx/Track08-MP3.mp3',
      /* 28 */ 'sfx/Track11-MP3.mp3',
      /* 29 */ 'sfx/TrolleyHornBeep_S08TT34-MP3.mp3'
    ]
    this.scales = [
      [0, 2, 4, 5, 7, 9, 11], // major
      [0, 2, 3, 5, 7, 8, 10], // minor
      [0, 2, 5, 7, 9], // penta
      [0, 2, 4, 6, 10] // dim
    ]
    this.currentScale = 1
    this.transpositions = [-12, -10, -8, -6]
    this.transpose = this.transpositions[0]
    this.limiter
    this.feedbackDelay
    this.pingPongDelay
    this.chorus
    this.hip1
    this.synth1 // "thinking" synth
    this.synth2, this.synth2_freeverb
    this.synth3
    this.synth4
    this.effectSamplers = []
    this.synth1_base_volume_factor = 0
    this.synth2_base_volume_factor = -19
    this.synth3_base_volume_factor = -1
    this.synth4_base_volume_factor = -3
    this.synth1_ghostNoteTriggeredFlag = false
    this.synth2_ghostNoteTriggeredFlag = false
    this.synth3_ghostNoteTriggeredFlag = false
    this.synth4_ghostNoteTriggeredFlag = false
    this.useSynth1Flag = true
    this.useSynth2Flag = true
    this.useSynth3Flag = true
    this.useSynth4Flag = true
    this.initializedFlag = false
    this.current_transport_position = {
      bars: 0,
      beats: 0,
      quarters: 0,
      ticks: 0 // not sure if this is expressed in ticks
    }
    this.previous_transport_position = {
      bars: 0,
      beats: 0,
      quarters: 0,
      ticks: 0 // not sure if this is expressed in ticks
    }
  }

  setAndPlay(volume = 10) {
    this.init()
    this.generativePartVolume(volume)
    this.setAllGenerative(true)
  }

  /**
   * Set generative track on/off
   * @param trackNumber
   * @param status on/off
   */
  setGenerativeTrackStatus(trackNumber: number, status: boolean): void {
    switch (trackNumber) {
      case 0:
        this.useSynth1Flag = status
        break
      case 1:
        this.useSynth2Flag = status
        break
      case 2:
        this.useSynth3Flag = status
        break
      case 3:
        this.useSynth4Flag = status
        break
      default:
        console.log(`Soundtrack, setGenerativeTrackStatus, unhandled trackNumber: ${trackNumber}`)
    }
  }

  /**
   * Set all generative tracks on/off
   * @param status
   */
  setAllGenerative(status: boolean): void {
    this.setGenerativeTrackStatus(0, status)
    this.setGenerativeTrackStatus(1, status)
    this.setGenerativeTrackStatus(2, status)
    this.setGenerativeTrackStatus(3, status)
  }

  /**
   * Get generative track status string
   * Thanks to the temp_holder param this method may be used from callbacks.
   * @param trackNumber
   */
  getGenerativeTrackStatusAsString(trackNumber: number): string {
    return this.getGenerativeTrackStatus(trackNumber) ? 'yes' : 'no'
  }

  /**
   * Get generative track status string
   * Thanks to the temp_holder param this method may be used from callbacks.
   * @param trackNumber
   */
  getGenerativeTrackStatus(trackNumber: number): boolean {
    if (!this.initializedFlag) {
      return false
    }
    switch (trackNumber) {
      case 0:
        return this.useSynth1Flag
      case 1:
        return this.useSynth2Flag
      case 2:
        return this.useSynth3Flag
      case 3:
        return this.useSynth4Flag
      default:
        console.log(`Soundtrack, getGenerativeTrackStatus, unhandled trackNumber: ${trackNumber}`)
    }
    return false
  }

  /**
   * Compare parts of transportPosition
   * @param part
   * @param a
   * @param b
   */
  transportPositionSegmentEquals(
    part: string,
    a: ITransportPosition,
    b: ITransportPosition
  ): boolean {
    part = part.toLowerCase()
    switch (part) {
      case 'bars':
        return a.bars === b.bars
      case 'beats':
        return a.beats === b.beats
      case 'quarters':
        return a.quarters === b.quarters
      case 'ticks':
        return a.ticks === b.ticks // if this value is represented by ticks...
      default:
        console.log(`[transportEquals] unhandled part = ${part}`)
    }
    return false
  }

  /**
   * Copy a transportPosition values to another
   * @param src source transportPosition
   * @param dst destination transportPosition
   */
  copyTransportPosition(src: ITransportPosition, dst: ITransportPosition): void {
    dst.bars = src.bars
    dst.beats = src.beats
    dst.quarters = src.quarters
    dst.ticks = src.ticks
  }

  /**
   * Parse transport string to transportPosition
   * @param dst
   * @param rawTransportData
   */
  parseTransportPosition(dst: ITransportPosition, rawTransportData: string): void {
    let segments_a = rawTransportData.split(':')
    dst.bars = parseInt(segments_a[0])
    dst.beats = parseInt(segments_a[1])
    let segments_b = segments_a[2].split('.')
    dst.quarters = parseInt(segments_b[0])
    dst.ticks = parseInt(segments_b[1])
  }

  /**
   * Get system milliseconds
   */
  systemMillis(): number {
    var d = new Date()
    return (
      d.getMilliseconds() +
      d.getSeconds() * 1000.0 +
      d.getMinutes() * 1000.0 * 60.0 +
      d.getHours() * 1000.0 * 60.0 * 60
    )
  }

  /**
   * Useless ?
   * @midi number
   */
  midiToName(midi: number): string {
    return this.MIDI_NUM_NAMES[midi]
  }

  /**
   * Find id from name
   * FIXME: Could use a better data structure
   * @param name
   */
  nameToMidi(name: string): number {
    name = name.toUpperCase()
    for (var i = 0; i < this.MIDI_NUM_NAMES.length; i++) {
      if (name === this.MIDI_NUM_NAMES[i]) {
        return i
      }
    }
    console.log(`[Soundtrack, nameToMidi] unhandled _name: ' + ${name}`)
    return -1
  }

  /**
   * Returns a midi note frequency
   * @param midiNote
   */
  mtof(midiNote: number): number {
    return 440 * Math.pow(2, (midiNote - 69) / 12)
  }

  /**
   * Is a note tuned?
   * FIXME: What is holder?
   * @param holder
   * @param note
   */
  isNoteTuned(holder: any, note: number): boolean {
    note = Math.abs(Math.floor(note))
    note = note % 12
    for (var i = 0; i < holder.scales[holder.currentScale].length; i++) {
      var temp = holder.scales[holder.currentScale][i] + holder.transpose
      while (temp < 0) {
        temp += 12
      }
      temp = temp % 12
      if (temp === note) {
        return true
      }
    }
    return false
  }

  /**
   * Seems to generate random chords
   * @param holder
   * @param nbNotes
   * @param min
   * @param max
   */
  randomChord(holder: any, nbNotes: number, min = 0, max = 0): number[] {
    var result: number[] = []
    nbNotes = Math.abs(Math.floor(nbNotes))
    if (nbNotes < 1) {
      return result
    }
    result[0] = holder.randomNote(holder, min, max)
    for (let i = 1; i < nbNotes; i++) {
      result[i] = holder.randomNote(holder, min, max)
      let temp_repeat = true
      let temp_maxIterations = 100
      let temp_iter = 0
      while (temp_repeat && temp_iter < temp_maxIterations) {
        let temp_b = true
        for (let j = 0; j < i; j++) {
          //FIXME: if (result[j === result[i]]) {
          if (result[j] === result[i]) {
            result[i] = holder.randomNote(holder, min, max)
            temp_b = false
            break
          }
          if (temp_b) temp_repeat = false
        }
        temp_iter += 1
      }
    }
    return result
  }

  /**
   * Seems to generate a random note
   * @param holder
   * @param min
   * @param max
   */
  randomNote(holder: any, min = 0, max = 0): number {
    min = Math.abs(Math.floor(min))
    max = Math.abs(Math.floor(max))
    if (min === max) {
      return min
    }
    if (min > max) {
      let temp = min
      min = max
      max = temp
    }
    let temp_range = max - min + 1
    let result = Math.floor(Math.random() * temp_range) + min
    if (holder.isNoteTuned(holder, result) && result <= max && result >= min) {
      return result
    }
    let dir = 1
    if (Math.random() < 0.5) {
      dir = -1
    }
    if (result > max) {
      dir = -1
    }
    if (result < min) {
      dir = 1
    }
    let rep = 0
    let max_rep = 300
    while (rep < max_rep) {
      result += dir
      if (result < 0) {
        result = 127
      }
      if (result > 127) {
        result = 0
      }
      if (holder.isNoteTuned(holder, result) && result >= min && result <= max) {
        return result
      }
      rep += 1
    }
    return result
  }

  /**
   * Initialize
   */
  init(): void {
    var temp_holder = this
    if (this.initializedFlag) {
      console.log(
        `[Soundtrack, init] warning: attempt to reinitialize a Soundtrack object that has already been initialized`
      )
    } else {
      Tone.context.latencyHint = this.latency_hint
      this.limiter = new Tone.Limiter({ threshold: -2 })
      this.limiter.disconnect()
      this.limiter.toMaster()
      this.hip1 = new Tone.Filter(1000, 'highpass')
      this.hip1.disconnect()
      this.hip1.connect(this.limiter)
      this.feedbackDelay = new Tone.FeedbackDelay('8n', 0.7)
      this.feedbackDelay.disconnect()
      this.feedbackDelay.connect(this.hip1)
      this.chorus = new Tone.Chorus(4, 2.5, 0.5)
      this.chorus.disconnect()
      this.chorus.connect(this.hip1)
      this.pingPongDelay = new Tone.PingPongDelay('4n', 0.2)
      this.pingPongDelay.connect(this.hip1)
      this.synth1 = new Tone.PolySynth(4, Tone.Synth, {
        oscillator: { type: 'sine3' },
        envelope: { attack: 0.2, decay: 0.6, sustain: 0.3, release: 1.1 }
      })
      this.synth1.disconnect()
      this.synth1.connect(this.feedbackDelay)
      this.synth1.connect(this.pingPongDelay)
      this.synth1.volume.value = this.synth1_base_volume_factor
      this.synth2_freeverb = new Tone.Freeverb({
        roomSize: 0.97,
        dampening: 500,
        wet: 1.0,
        dry: 0.0
      })
      this.synth2_freeverb.disconnect()
      this.synth2 = new Tone.PolySynth(1, Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 0.3 }
      })
      this.synth2.disconnect()
      this.synth2.connect(this.chorus)
      this.synth2.connect(this.synth2_freeverb)
      this.synth2_freeverb.connect(this.hip1)
      this.synth2.volume.value = this.synth2_base_volume_factor
      this.synth3 = new Tone.AMSynth({
        harmonicity: 0.5,
        oscillator: {
          type: 'amsine2',
          modulationType: 'sine',
          harmonicity: 1.0
        },
        envelope: {
          attack: 0.406,
          decay: 1,
          sustain: 0.34,
          release: 1.2
        },
        modulation: {
          volume: 2,
          type: 'amsine',
          modulationType: 'triangle',
          harmonicity: 2
        },
        modulationEnvelope: {
          attack: 0.006,
          decay: 0.2,
          sustain: 0.2,
          release: 0.4
        }
      })
      this.synth3.volume.value = this.synth3_base_volume_factor
      this.synth3.disconnect()
      this.synth3.connect(this.limiter)
      this.synth4 = new Tone.AMSynth({
        harmonicity: 0.5,
        oscillator: {
          type: 'amsine2',
          modulationType: 'sine3',
          harmonicity: 1.5
        },
        envelope: {
          attack: 0.206,
          decay: 0.3,
          sustain: 0.34,
          release: 2.2
        },
        modulation: {
          volume: 2,
          type: 'amsine3',
          modulationType: 'sine4',
          harmonicity: 2
        },
        modulationEnvelope: {
          attack: 0.2,
          decay: 0.2,
          sustain: 0.2,
          release: 1.4
        }
      })
      this.synth4.volume.value = this.synth4_base_volume_factor
      this.synth4.disconnect()
      //this.synth4.connect(this.synth2_freeverb);
      //this.synth4.connect(this.chorus);
      this.synth4.connect(this.feedbackDelay)
      this.synth4.connect(this.pingPongDelay)

      for (let i = 0; i < this.samples.length; i++) {
        this.effectSamplers[i] = new Tone.Sampler({ C4: this.samples[i] })
        this.effectSamplers[i].disconnect()
        //this.effectSamplers[i].connect(this.feedbackDelay);
        //this.effectSamplers[i].connect(this.pingPongDelay);
        this.effectSamplers[i].connect(this.chorus)
        this.effectSamplers[i].volume.value = 0.3
        //this.effectSamplers[i].connect(this.limiter);
      }
      Tone.Transport.scheduleRepeat((time: number) => {
        /*
          Really ugly part. Bacause callbacks triggered from the scheduler are
          not connected to the curent object itself (but to the global namespace)
          we have to use the object's name explicitly...
        */
        temp_holder.copyTransportPosition(
          temp_holder.current_transport_position,
          temp_holder.previous_transport_position
        )
        temp_holder.parseTransportPosition(
          temp_holder.current_transport_position,
          Tone.Transport.position
        )
        // ****************************** scale ****************************** \\
        if (
          !temp_holder.transportPositionSegmentEquals(
            'bars',
            temp_holder.current_transport_position,
            temp_holder.previous_transport_position
          ) &&
          temp_holder.current_transport_position.bars % 2 === 0 &&
          Math.random() > 0.8
        ) {
          var temp_scale = Math.floor(Math.random() * temp_holder.scales.length)
          temp_holder.currentScale = temp_scale
          console.log('scale = ' + temp_scale)
        }
        // **************************** transpose **************************** \\
        if (
          !temp_holder.transportPositionSegmentEquals(
            'bars',
            temp_holder.current_transport_position,
            temp_holder.previous_transport_position
          ) &&
          temp_holder.current_transport_position.bars % 2 === 0 &&
          Math.random() > 0.8
        ) {
          var temp_transpose = Math.floor(Math.random() * temp_holder.transpositions.length)
          temp_holder.transpose = temp_holder.transpositions[temp_transpose]
          console.log('transpose = ' + temp_transpose)
        }
        // ***************************** synth 1 ***************************** \\
        if (
          !temp_holder.transportPositionSegmentEquals(
            'bars',
            temp_holder.current_transport_position,
            temp_holder.previous_transport_position
          ) &&
          temp_holder.useSynth1Flag
        ) {
          if (
            temp_holder.current_transport_position.bars % 2 === 0 &&
            (Math.random() > 0.6 || temp_holder.synth1_ghostNoteTriggeredFlag)
          ) {
            temp_holder.synth1_ghostNoteTriggeredFlag = false
            var temp_chord = temp_holder.randomChord(temp_holder, 4, 40, 60)
            for (let i = 0; i < temp_chord.length; i++) {
              var temp_b = true
              for (let j = 0; j < i; j++) {
                if (temp_chord[j] == temp_chord[i]) {
                  temp_b = false
                  break
                }
              }
              if (temp_b) {
                temp_holder.synth1.triggerAttackRelease(temp_holder.mtof(temp_chord[i]), '1n')
              }
            }
          }
        }
        if (
          !temp_holder.transportPositionSegmentEquals(
            'quarters',
            temp_holder.current_transport_position,
            temp_holder.previous_transport_position
          ) &&
          temp_holder.current_transport_position.bars % 2 !== 0 &&
          temp_holder.current_transport_position.beats === 0 &&
          temp_holder.current_transport_position.quarters === 3 &&
          Math.random() > 0.7 &&
          temp_holder.useSynth1Flag
        ) {
          temp_holder.synth1_ghostNoteTriggeredFlag = true
          //console.log(temp_holder.current_transport_position.bits + ' ' + temp_holder.current_transport_position.quarters);
          var temp_chord_bis = temp_holder.randomChord(temp_holder, 3, 40, 60)
          for (let i = 0; i < temp_chord_bis.length; i++) {
            var temp_b_bis = true
            for (let j = 0; j < i; j++) {
              if (temp_chord_bis[j] == temp_chord_bis[i]) {
                temp_b_bis = false
                break
              }
            }
            if (temp_b_bis) {
              temp_holder.synth1.triggerAttackRelease(temp_holder.mtof(temp_chord_bis[i]), '4n')
            }
          }
        }
        // ***************************** synth 2 ***************************** \\
        if (
          !temp_holder.transportPositionSegmentEquals(
            'bars',
            temp_holder.current_transport_position,
            temp_holder.previous_transport_position
          ) &&
          temp_holder.useSynth2Flag
        ) {
          if (
            temp_holder.current_transport_position.bars % 2 === 1 &&
            (Math.random() > 0.7 || temp_holder.synth2_ghostNoteTriggeredFlag)
          ) {
            temp_holder.synth2_ghostNoteTriggeredFlag = false
            temp_holder.synth2.triggerAttackRelease(
              temp_holder.mtof(temp_holder.randomNote(temp_holder, 56, 90)),
              '16n'
            ) // temp_holder.mtof(temp_holder.randomNote(temp_holder, 60, 96))
          }
        }
        if (
          !temp_holder.transportPositionSegmentEquals(
            'quarters',
            temp_holder.current_transport_position,
            temp_holder.previous_transport_position
          ) &&
          temp_holder.current_transport_position.bars % 2 !== 1 &&
          temp_holder.current_transport_position.beats === 0 &&
          temp_holder.current_transport_position.quarters === 3 &&
          Math.random() > 0.7 &&
          temp_holder.useSynth2Flag
        ) {
          temp_holder.synth2_ghostNoteTriggeredFlag = true
          temp_holder.synth2.triggerAttackRelease(
            temp_holder.mtof(temp_holder.randomNote(temp_holder, 56, 90)),
            '16n'
          )
        }
        // ***************************** synth 3 ***************************** \\
        if (
          !temp_holder.transportPositionSegmentEquals(
            'bars',
            temp_holder.current_transport_position,
            temp_holder.previous_transport_position
          ) &&
          temp_holder.useSynth3Flag
        ) {
          if (
            temp_holder.current_transport_position.bars % 2 === 0 &&
            (Math.random() > 0.5 || temp_holder.synth3_ghostNoteTriggeredFlag)
          ) {
            temp_holder.synth3_ghostNoteTriggeredFlag = false
            temp_holder.synth3.triggerAttackRelease(
              temp_holder.mtof(temp_holder.randomNote(temp_holder, 30, 48)),
              '1n'
            ) // temp_holder.mtof(temp_holder.randomNote(temp_holder, 60, 96))
          }
        }
        if (
          !temp_holder.transportPositionSegmentEquals(
            'quarters',
            temp_holder.current_transport_position,
            temp_holder.previous_transport_position
          ) &&
          temp_holder.useSynth3Flag
        ) {
          if (
            temp_holder.current_transport_position.quarters === 2 &&
            (Math.random() > 0.5 || temp_holder.synth3_ghostNoteTriggeredFlag)
          ) {
            temp_holder.synth3_ghostNoteTriggeredFlag = false
            temp_holder.synth3.triggerAttackRelease(
              temp_holder.mtof(temp_holder.randomNote(temp_holder, 30, 48)),
              '2n'
            ) // temp_holder.mtof(temp_holder.randomNote(temp_holder, 60, 96))
          }
        }
        // ***************************** synth 4 ***************************** \\
        if (
          !temp_holder.transportPositionSegmentEquals(
            'bars',
            temp_holder.current_transport_position,
            temp_holder.previous_transport_position
          ) &&
          temp_holder.useSynth4Flag
        ) {
          if (
            temp_holder.current_transport_position.bars % 4 === 0 &&
            (Math.random() > 0.0 || temp_holder.synth4_ghostNoteTriggeredFlag)
          ) {
            console.log(Math.random())
            temp_holder.synth4_ghostNoteTriggeredFlag = false
            temp_holder.synth4.triggerAttackRelease(
              temp_holder.mtof(temp_holder.randomNote(temp_holder, 26, 46)),
              '1m'
            ) // temp_holder.mtof(temp_holder.randomNote(temp_holder, 60, 96))
          }
        }
      }, '16n')
      Tone.Transport.start()
      this.initializedFlag = true
      console.log('[Soundtrack, init] soundtrack initialized')
    }
  }

  /**
   * Generative part volume
   * @param holder
   * @param volume
   */
  generativePartVolume(volume: number): void {
    this.synth1.volume.value = this.synth1_base_volume_factor + volume
    this.synth2.volume.value = this.synth2_base_volume_factor + volume
    this.synth3.volume.value = this.synth3_base_volume_factor + volume
    this.synth4.volume.value = this.synth4_base_volume_factor + volume
  }

  // /*
  //   Thanks to the temp_holder param this method may be used from callbacks.
  // */
  // effectVolume(_a, _b: number, _c: number): void {
  //   // _holder, _effectNumber, _volume
  //   var temp_holder, temp_effectNumber, temp_volume
  //   if (arguments.length === 2) {
  //     temp_holder = this
  //     temp_effectNumber = _a
  //     temp_volume = _b
  //   } else {
  //     if (arguments.length === 3) {
  //       temp_holder = _a
  //       temp_effectNumber = _b
  //       temp_volume = _c
  //     } else {
  //       console.log('[Soundtrack, effectVolume] incorrect number of arguments: ' + arguments.length)
  //     }
  //   }
  //   temp_holder._effectVolume(temp_holder, temp_effectNumber, temp_volume)
  // }

  /*
    Thanks to the _holder param this method may be used from callbacks.
  */
  effectVolume(effectNumber: number, volume: number): void {
    if (volume < 0.0) {
      console.log('[Soundtrack, _effectVolume] volume < 0.0: ' + volume + ' changed to 0.0')
      volume = 0.0
    }
    if (volume > 1.0) {
      console.log('[Soundtrack, _effectVolume] volume > 1.0: ' + volume + ' changed to 1.0')
      volume = 1.0
    }
    effectNumber = Math.floor(effectNumber)
    if (effectNumber < 0) {
      console.log('[Soundtrack, _effectVolume] effectNumber < 0: ' + effectNumber + ' changed to 0')
      effectNumber = 0
    }
    if (effectNumber >= this.samples.length) {
      console.log(
        `[Soundtrack, _effectVolume] effectNumber >= this.samples.length: ' +
          ${effectNumber} changed to this.samples.length - 1 (
          ${this.samples.length - 1})`
      )
      effectNumber = this.samples.length - 1
    }
    this.effectSamplers[effectNumber].volume.value = volume
  }

  // /*
  //   Thanks to the temp_holder param this method may be used from callbacks.
  // */
  // triggerEffect(_a, _b: number, _c: number): void {
  //   // _holder, _effectNumber, _pitch
  //   var temp_holder, temp_effectNumber, temp_pitch
  //   if (arguments.length === 2) {
  //     temp_holder = this
  //     temp_effectNumber = _a
  //     temp_pitch = _b
  //   } else {
  //     if (arguments.length === 3) {
  //       temp_holder = _a
  //       temp_effectNumber = _b
  //       temp_pitch = _c
  //     } else {
  //       console.log(
  //         '[Soundtrack, triggerEffect] incorrect number of arguments: ' + arguments.length
  //       )
  //     }
  //   }
  //   temp_holder._triggerEffect(temp_holder, temp_effectNumber, temp_pitch)
  // }

  /*
    Thanks to the _holder param this method may be used from callbacks.
  */
  triggerEffect(effectNumber: number, normPitch: number) {
    if (normPitch < 0.0) {
      console.log('[Soundtrack, _triggerEffect] normPitch < 0.0: ' + normPitch + ' changed to 0.0')
      normPitch = 0.0
    }
    if (normPitch > 1.0) {
      console.log('[Soundtrack, _triggerEffect] normPitch > 1.0: ' + normPitch + ' changed to 1.0')
      normPitch = 1.0
    }
    effectNumber = Math.floor(effectNumber)
    if (effectNumber < 0) {
      console.log(
        '[Soundtrack, _triggerEffect] effectNumber < 0: ' + effectNumber + ' changed to 0'
      )
      effectNumber = 0
    }
    if (effectNumber >= this.samples.length) {
      console.log(
        `[Soundtrack, _triggerEffect] effectNumber >= this.samples.length:
          ${effectNumber}
          changed to this.samples.length - 1
          (
          ${this.samples.length - 1}
          )`
      )
      effectNumber = this.samples.length - 1
    }
    var temp_midi = this.nameToMidi('C4') + Math.floor(normPitch * 25.0) - 12
    var temp_noteName = this.midiToName(temp_midi)
    if (this.effectSamplers[effectNumber].loaded) {
      this.effectSamplers[effectNumber].triggerAttack(temp_noteName)
      //console.log("[Soundtrack, _triggerEffect] start " + _holder + " " + temp_midi + " " + temp_noteName);
    } else {
      console.log('[Soundtrack, _triggerEffect] samples not loaded (yet?)')
    }
  }
}
