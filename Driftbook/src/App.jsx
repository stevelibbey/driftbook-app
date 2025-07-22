import React, { useEffect, useState } from 'react';
import Viewer from './components/Viewer.jsx';
import SoundUI from './components/SoundUI.jsx';
import './App.css';

import { initSoundEngine } from './sound/synthEngine.jsx';
import { initMIDI } from './sound/midiHandler.jsx';

export default function App() {
  const [installationsData, setInstallationsData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load JSON from /public folder
    fetch('/installations.json')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        window.installations = data.installations;
        setInstallationsData(data);
      })
      .catch((err) => {
        console.error('Error loading installations.json:', err);
        setError(err.message);
      });

    initSoundEngine();
    initMIDI();
  }, []);

  if (error) {
    return <div style={{ color: 'red' }}>Error loading Driftbook: {error}</div>;
  }

  if (!installationsData) {
    return <div style={{ padding: '2rem', color: 'white' }}>Loading Driftbook...</div>;
  }

if (!installationsData || !installationsData.installations) {
  return <div style={{ color: 'white' }}>Loading Driftbook...</div>;
}

const initial = installationsData.installations[0];

  return (
    <div style={{ minHeight: '100vh', background: 'black', color: 'white' }}>
<Viewer installation={initial} />
      <SoundUI />
    </div>
  );
}
