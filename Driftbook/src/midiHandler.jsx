
// Handles MIDI input and playback behavior
export const initMIDI = async (onNoteOn, onNoteOff) => {
  if (!navigator.requestMIDIAccess) {
    console.warn("WebMIDI is not supported in this browser.");
    return;
  }
  const midi = await navigator.requestMIDIAccess();
  for (let input of midi.inputs.values()) {
    input.onmidimessage = (msg) => {
      const [command, note, velocity] = msg.data;
      if (command === 144 && velocity > 0) onNoteOn(note, velocity);  // Note on
      else if (command === 128 || (command === 144 && velocity === 0)) onNoteOff(note);  // Note off
    };
  }
};
