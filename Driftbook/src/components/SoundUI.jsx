// src/components/SoundUI.js

import React, { useState } from 'react';
import {
  patches,
  setPatchByIndex,
  setFilterCutoff,
  setFilterQ,
  setMasterVolume
} from '../sound/synthEngine';

export default function SoundUI() {
  const [patchIndex, setPatchIndex] = useState(0);
  const [cutoff, setCut]            = useState(1000);
  const [q, setQ]                   = useState(1);
  const [vol, setVol]               = useState(0);

  return (
    <div style={{
      position: 'absolute',
      top: 20,
      left: 20,
      background: 'rgba(0,0,0,0.7)',
      color: 'white',
      padding: 10,
      borderRadius: 4,
      fontFamily: 'monospace',
      zIndex: 1000
    }}>
      {/* Patch selector */}
      <div>
        <label>
          Patch:
          <select
            value={patchIndex}
            onChange={e => {
              const idx = Number(e.target.value);
              setPatchIndex(idx);
              setPatchByIndex(idx);
            }}
            style={{ marginLeft: 8 }}
          >
            {patches.map((p, i) => (
              <option key={i} value={i}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Filter cutoff */}
      <div style={{ marginTop: 8 }}>
        <label>
          Cutoff: {Math.round(cutoff)} Hz<br/>
          <input
            type="range"
            min="200"
            max="5000"
            value={cutoff}
            onChange={e => {
              const val = Number(e.target.value);
              setCut(val);
              setFilterCutoff(val);
            }}
          />
        </label>
      </div>

      {/* Filter resonance (Q) */}
      <div style={{ marginTop: 8 }}>
        <label>
          Reso: {q.toFixed(1)}<br/>
          <input
            type="range"
            min="0.5"
            max="20"
            step="0.1"
            value={q}
            onChange={e => {
              const val = Number(e.target.value);
              setQ(val);
              setFilterQ(val);
            }}
          />
        </label>
      </div>

      {/* Master volume */}
      <div style={{ marginTop: 8 }}>
        <label>
          Volume: {vol} dB<br/>
          <input
            type="range"
            min="-40"
            max="0"
            value={vol}
            onChange={e => {
              const val = Number(e.target.value);
              setVol(val);
              setMasterVolume(val);
            }}
          />
        </label>
      </div>

      {/* Keyboard shortcuts */}
      <div style={{
        marginTop: 12,
        paddingTop: 8,
        borderTop: '1px solid rgba(255,255,255,0.3)',
        fontSize: 12,
        lineHeight: 1.4
      }}>
        <strong>Keyboard Shortcuts</strong><br/>
        M: Next installation<br/>
        ←/→/↑/↓: Pan image<br/>
        A / D: Frame step<br/>
        Space: Play / Pause<br/>
        – / =: FPS<br/>
        Z / X: Zoom<br/>
        1–9: Play zone (with Shift, Alt, Ctrl modifiers)<br/>
        R: Reset view<br/>
        H: Toggle Help (grid overlay)<br/>
        F: Toggle Fullscreen<br/>
        P: Next synth patch<br/>
      </div>
    </div>
  );
}
