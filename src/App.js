import React, { useEffect } from 'react';
import Viewer from './components/Viewer';
import SoundUI from './components/SoundUI';
import installationsData from './installations.json';

// Sound engine & MIDI
import { initSoundEngine } from './sound/synthEngine';
import { initMIDI } from './sound/midiHandler';

export default function App() {
  // expose installations globally for Viewer
  window.installations = installationsData.installations;

  useEffect(() => {
    initSoundEngine();                     // set up Tone.js nodes
    initMIDI();                            // wire up Web MIDI → synthEngine
  }, []);

  // start with first installation
  const initial = installationsData.installations[0];

  return (
    <>
      <Viewer installation={initial} />
      <SoundUI />
    </>
  );
}
