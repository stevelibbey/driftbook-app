import React, { useState, useEffect } from 'react';
import Viewer from './components/Viewer.jsx';
import SoundUI from './components/SoundUI.jsx';
import './App.css';

import { initSoundEngine } from './sound/synthEngine.jsx';
import { initMIDI } from './sound/midiHandler.jsx';

export default function App() {
  const [installationsData, setInstallationsData] = useState(null);
  const [error, setError] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Preload installations.json on mount
    fetch(`${import.meta.env.BASE_URL}installations.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setInstallationsData(data);
      })
      .catch((err) => {
        console.error('Error loading installations.json:', err);
        setError(err.message);
      });
  }, []);

  const handleStart = () => {
    window.Tone?.start?.().then(() => {
      initSoundEngine();
      initMIDI();
      setHasStarted(true);
    });
  };

  if (error) {
    return <div style={{ padding: '2rem', color: 'red' }}>Error loading Driftbook: {error}</div>;
  }

  if (!installationsData || !installationsData.installations) {
    return <div style={{ padding: '2rem', color: 'white' }}>Loading Driftbook...</div>;
  }

  if (!hasStarted) {
    return (
      <div style={{ padding: '2rem', color: 'white' }}>
        <button
          onClick={handleStart}
          style={{
            fontSize: '1.25rem',
            padding: '1rem 2rem',
            background: 'white',
            color: 'black',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Start Driftbook
        </button>
      </div>
    );
  }

  const initial = installationsData.installations[0];

  return (
    <div style={{ minHeight: '100vh', background: 'black', color: 'white' }}>
      <Viewer installation={initial} />
      <SoundUI />
    </div>
  );
}
