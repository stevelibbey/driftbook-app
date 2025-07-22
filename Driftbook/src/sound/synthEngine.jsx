// src/sound/synthEngine.js

import * as Tone from 'tone';

let synth, filter, volume;
export const patches = [
  {
    name: "Square Lead",
    oscillator: { type: "square" },
    envelope:   { attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.5 }
  },
  {
    name: "Saw Bass",
    oscillator: { type: "sawtooth" },
    envelope:   { attack: 0.02, decay: 0.1, sustain: 0.8, release: 0.3 }
  },
  {
    name: "Poly Pad",
    oscillator: { type: "triangle" },
    envelope:   { attack: 0.5, decay: 0.2, sustain: 0.6, release: 1.5 }
  },
  {
    name: "Metal Bell",
    oscillator: { type: "fmsquare", modulationIndex: 3 },
    envelope:   { attack: 0.001, decay: 0.2, sustain: 0.0, release: 0.3 }
  },
  {
    name: "Percussive Stab",
    oscillator: { type: "square" },
    envelope:   { attack: 0.001, decay: 0.05, sustain: 0.0, release: 0.1 }
  }
];

let currentPatch = 0;

/**
 * Initializes the Tone.js synth chain (PolySynth → Filter → Volume → Destination).
 */
export function initSoundEngine() {
  if (synth) return;

  // Create a polyphonic synth with up to 16 voices
  synth = new Tone.PolySynth(Tone.Synth, {
    maxPolyphony: 16,
    oscillator: patches[currentPatch].oscillator,
    envelope: patches[currentPatch].envelope
  });

  // A simple low-pass filter for tonal shaping
  filter = new Tone.Filter(1000, 'lowpass');

  // Master volume control
  volume = new Tone.Volume(0);

  // Chain them together
  synth.connect(filter);
  filter.connect(volume);
  volume.toDestination();
}

/**
 * Plays a single note. Automatically starts AudioContext on first use.
 *
 * @param {string} note     Tone.js note name (e.g. "C4")
 * @param {string} duration Tone.js duration string (e.g. "8n")
 * @param {number} velocity 0–1 velocity
 */
export function playNote(note = 'C4', duration = '8n', velocity = 0.8) {
  if (Tone.context.state !== 'running') {
    Tone.start(); // unlock audio on first user interaction
  }
  if (!synth) initSoundEngine();
  synth.triggerAttackRelease(note, duration, undefined, velocity);
}

/** Adjust the low-pass filter cutoff frequency (in Hz). */
export function setFilterCutoff(freq) {
  if (filter) filter.frequency.value = freq;
}

/** Adjust the filter Q (resonance). */
export function setFilterQ(q) {
  if (filter) filter.Q.value = q;
}

/** Adjust the master output volume (in dB). */
export function setMasterVolume(db) {
  if (volume) volume.volume.value = db;
}

/**
 * Advance to the next patch in the `patches` array,
 * reconfiguring oscillator & envelope.
 * @returns {string} The name of the selected patch.
 */
export function nextPatch() {
  currentPatch = (currentPatch + 1) % patches.length;
  const p = patches[currentPatch];
  if (synth) {
    synth.set({ oscillator: p.oscillator, envelope: p.envelope });
  }
  return p.name;
}

/**
 * Select a patch by its index in `patches`.
 * @param {number} i Index of the patch to select.
 * @returns {string} The name of the selected patch.
 */
export function setPatchByIndex(i) {
  currentPatch = i % patches.length;
  const p = patches[currentPatch];
  if (synth) {
    synth.set({ oscillator: p.oscillator, envelope: p.envelope });
  }
  return p.name;
}
