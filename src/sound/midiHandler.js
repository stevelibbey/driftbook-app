import { initSoundEngine, playNote } from './synthEngine';
import * as Tone from 'tone';

export async function initMIDI() {
  await initSoundEngine();
  if (!navigator.requestMIDIAccess) {
    console.warn('Web MIDI not supported');
    return;
  }
  try {
    const access = await navigator.requestMIDIAccess();
    for (let input of access.inputs.values()) {
      input.onmidimessage = onMIDIMessage;
    }
  } catch(e) {
    console.error('MIDI init failed', e);
  }
}

function onMIDIMessage(msg) {
  const [status, d1, d2] = msg.data;
  const cmd = status & 0xf0;
  if (cmd === 0x90 && d2>0) {      // note on
    const note = Tone.Frequency(d1,'midi').toNote();
    playNote(note,'8n', d2/127);
  }
}
