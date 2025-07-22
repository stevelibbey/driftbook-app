// synth/synth.js

import * as Tone from 'tone';

let synth;

/**
 * Initialize a PolySynth (up to 16 voices) on first use.
 */
function initSynth() {
  if (!synth) {
    synth = new Tone.PolySynth({
      voice: Tone.Synth,
      options: {
        oscillator: { type: 'square' },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.5 }
      },
      maxPolyphony: 16
    }).toDestination();
  }
}

/**
 * Play a single note. PolySynth allows multiple notes at once.
 *
 * @param {string} note     Tone.js note name (e.g. 'C4')
 * @param {string} duration A Tone.js duration string (e.g. '8n')
 * @param {number} velocity 0–1 velocity (optional)
 */
export function playNote(note = 'C4', duration = '8n', velocity = 0.8) {
  initSynth();
  if (!synth) return;
  // Omit the explicit time argument so it defaults to Tone.now()
  synth.triggerAttackRelease(note, duration, undefined, velocity);
}
