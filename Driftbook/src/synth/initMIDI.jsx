
export async function initMIDI(onMIDIMessage) {
  if (navigator.requestMIDIAccess) {
    try {
      const midiAccess = await navigator.requestMIDIAccess();
      for (const input of midiAccess.inputs.values()) {
        input.onmidimessage = onMIDIMessage;
      }
    } catch (err) {
      console.error('MIDI initialization failed:', err);
    }
  } else {
    console.warn('Web MIDI API not supported in this browser.');
  }
}
