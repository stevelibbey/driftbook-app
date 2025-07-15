/**
 * Analyze canvas in an R×C grid, returning an array of metric objects per cell.
 */
export function analyzeZoneMetrics(canvas, rows=3, cols=3) {
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  const zoneW = Math.floor(width/cols), zoneH = Math.floor(height/rows);
  const metrics = [];

  // simple Sobel kernels
  const sobelX = [-1,0,1, -2,0,2, -1,0,1];
  const sobelY = [-1,-2,-1, 0,0,0, 1,2,1];

  for (let ry=0; ry<rows; ry++) {
    for (let cx=0; cx<cols; cx++) {
      const img = ctx.getImageData(cx*zoneW, ry*zoneH, zoneW, zoneH);
      const data = img.data;
      let sumB=0, sumDev=0, sumSat=0, edgeCount=0;
      const pix = zoneW*zoneH;
      const br = new Float32Array(pix);

      // compute brightness & saturation
      for (let i=0,pi=0; i<data.length; i+=4,pi++){
        const [r,g,b] = [data[i],data[i+1],data[i+2]];
        const bright = (r+g+b)/3;
        sumB += bright; br[pi]=bright;
        const mx = Math.max(r,g,b), mn=Math.min(r,g,b);
        sumSat += mx?((mx-mn)/mx):0;
      }
      const mB = sumB/pix, mSat = sumSat/pix;

      // contrast & edge-density
      for (let py=1; py<zoneH-1; py++) {
        for (let px=1; px<zoneW-1; px++) {
          const idx = py*zoneW+px;
          sumDev += Math.abs(br[idx]-mB);
          // sobel
          let gx=0, gy=0, k=0;
          for (let wy=-1;wy<=1;wy++){
            for (let wx=-1;wx<=1;wx++,k++){
              const bval = br[(py+wy)*zoneW+(px+wx)];
              gx += sobelX[k]*bval;
              gy += sobelY[k]*bval;
            }
          }
          if (Math.hypot(gx,gy)>20) edgeCount++;
        }
      }

      metrics.push({
        brightness:  mB,
        contrast:    sumDev/pix,
        saturation:  mSat,
        edgeDensity: edgeCount/pix
      });
    }
  }
  return metrics;
}

/** Map brightness (0–255) to a pitch in an array. */
export function brightnessToPitch(bright) {
  const scale = ['C3','D3','E3','F3','G3','A3','B3','C4','D4','E4'];
  const idx = Math.floor((bright/256)*scale.length);
  return scale[Math.max(0,Math.min(idx,scale.length-1))];
}
