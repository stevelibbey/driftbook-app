
// Provides real-time pixel analysis of the canvas
export const analyzeImage = (canvas) => {
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;
  const data = ctx.getImageData(0, 0, width, height).data;

  let brightnessSum = 0;
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i+1] + data[i+2]) / 3;
    brightnessSum += avg;
  }
  return brightnessSum / (width * height);
};
