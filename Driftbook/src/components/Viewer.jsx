import React, { useRef, useEffect, useState, useCallback } from 'react';
import { analyzeZoneMetrics } from '../utils';
import { brightnessToPitch } from '../utils';
import { playNote } from '../sound/synthEngine';

export default function Viewer({ installation }) {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const frameInterval = useRef(null);

  const [currentInstall, setCurrentInstall] = useState(installation);
  const [frameIndex, setFrameIndex]       = useState(0);
  const [playing, setPlaying]             = useState(false);
  const [fps, setFps]                     = useState(installation.fps || 6);
  const [zoom, setZoom]                   = useState(1);
  const [offset, setOffset]               = useState({ x: 0, y: 0 });
  const [showHelp, setShowHelp]           = useState(false);
  const [gridMetrics, setGridMetrics]     = useState([]);

  // Draw & compute metrics
  const drawFrame = useCallback(index => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    const img    = imagesRef.current[index];
    if (!img) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(zoom, zoom);
    ctx.drawImage(img, 0, 0);
    ctx.restore();

    // compute 3×3 metrics
    const metrics = analyzeZoneMetrics(canvas, 3, 3);
    setGridMetrics(metrics);

    // overlay grid+numbers when help is shown
    if (showHelp) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth   = 1;
      const cols = 3, rows = 3;
      const zoneW = width/cols, zoneH = height/rows;
      const fontSize = Math.floor(Math.min(zoneW, zoneH)*0.75);
      ctx.font = `${fontSize}px monospace`;
      ctx.fillStyle    = 'rgba(255,255,255,0.8)';
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';

      // lines
      for (let i=1;i<cols;i++){
        const x=i*zoneW;
        ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,height); ctx.stroke();
      }
      for (let j=1;j<rows;j++){
        const y=j*zoneH;
        ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(width,y); ctx.stroke();
      }

      // numbers 1–9
      for (let i=0;i<9;i++){
        const r = Math.floor(i/3), c = i%3;
        const cx = c*zoneW + zoneW/2, cy = r*zoneH + zoneH/2;
        ctx.fillText((i+1).toString(), cx, cy);
      }
      ctx.restore();
    }
  }, [zoom, offset, showHelp]);

  // preload images
  useEffect(() => {
    Promise.all(
      currentInstall.images.map(src =>
        new Promise(res => {
          const img = new Image();
          img.onload = () => res(img);
          img.src    = src;
        })
      )
    ).then(imgs => {
      imagesRef.current = imgs;
      const c = canvasRef.current;
      c.width  = imgs[0].width;
      c.height = imgs[0].height;
      setFrameIndex(0);
      drawFrame(0);
    });
  }, [currentInstall, drawFrame]);

  // keyboard controls
  useEffect(() => {
    const handler = e => {
      // 1–9 play chosen metric
      if (/^[1-9]$/.test(e.key)) {
        const idx = +e.key - 1;
        const m   = gridMetrics[idx];
        if (m) {
          // default: brightness, shift→contrast, alt→saturation, ctrl→edgeDensity
          let val = m.brightness;
          if (e.shiftKey)      val = m.contrast;
          else if (e.altKey)   val = m.saturation;
          else if (e.ctrlKey)  val = m.edgeDensity;
          const pitch    = brightnessToPitch(val);
          const velocity = Math.min(1, val/255);
          playNote(pitch, '8n', velocity);
        }
        return;
      }

      switch (e.key) {
        // pan
        case 'ArrowLeft':  setOffset(o=>({...o,x:o.x+10})); break;
        case 'ArrowRight': setOffset(o=>({...o,x:o.x-10})); break;
        case 'ArrowUp':    setOffset(o=>({...o,y:o.y+10})); break;
        case 'ArrowDown':  setOffset(o=>({...o,y:o.y-10})); break;
        // frame
        case 'a': case 'A':
          setFrameIndex(i=>(i-1+imagesRef.current.length)%imagesRef.current.length);
          break;
        case 'd': case 'D':
          setFrameIndex(i=>(i+1)%imagesRef.current.length);
          break;
        // play/pause
        case ' ':
          setPlaying(p=>!p);
          break;
        // fps
        case '-':
          setFps(f=>Math.max(1,f-1));
          break;
        case '=':
          setFps(f=>Math.min(60,f+1));
          break;
        // zoom
        case 'z': setZoom(z=>z*1.1); break;
        case 'x': setZoom(z=>z/1.1); break;
        // reset
        case 'r': case 'R':
          setZoom(1); setOffset({x:0,y:0}); break;
        // install
        case 'm': case 'M': {
          const idx = window.installations.findIndex(i=>i.slug===currentInstall.slug);
          setCurrentInstall(window.installations[(idx+1)%window.installations.length]);
          break;
        }
        // help
        case 'h': case 'H':
          setShowHelp(h=>!h);
          break;
        // fullscreen placeholder
        case 'f': case 'F': break;
      }
    };
    window.addEventListener('keydown', handler);
    return()=>window.removeEventListener('keydown', handler);
  }, [gridMetrics, currentInstall, playing, fps, zoom, offset]);

  // autoplay
  useEffect(() => {
    if (playing) {
      frameInterval.current = setInterval(
        ()=>setFrameIndex(i=>(i+1)%imagesRef.current.length),
        1000/fps
      );
    } else clearInterval(frameInterval.current);
    return()=>clearInterval(frameInterval.current);
  }, [playing, fps]);

  // redraw on frame or help toggle
  useEffect(()=>{ drawFrame(frameIndex); }, [frameIndex, drawFrame, showHelp]);

  return (
    <div style={{
      display:'flex',justifyContent:'center',alignItems:'center',
      width:'100vw',height:'100vh',position:'relative',
      overflow:'hidden',background:'black'
    }}>
      <canvas ref={canvasRef} style={{
        cursor:'crosshair',imageRendering:'pixelated',
        maxWidth:'100%',maxHeight:'100%',width:'auto',height:'auto'
      }}/>
    </div>
  );
}
