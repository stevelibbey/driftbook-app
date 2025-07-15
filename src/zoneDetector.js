
// Detects activity in predefined spatial zones
export const defineZones = (canvas) => {
  const { width, height } = canvas;
  const halfW = width / 2;
  const halfH = height / 2;
  return [
    { id: "top-left",    x: 0, y: 0, width: halfW, height: halfH },
    { id: "top-right",   x: halfW, y: 0, width: halfW, height: halfH },
    { id: "bottom-left", x: 0, y: halfH, width: halfW, height: halfH },
    { id: "bottom-right",x: halfW, y: halfH, width: halfW, height: halfH }
  ];
};

export const checkZoneActivity = (canvas, zones) => {
  const ctx = canvas.getContext("2d");
  const activityMap = {};
  zones.forEach(zone => {
    const imgData = ctx.getImageData(zone.x, zone.y, zone.width, zone.height).data;
    let sum = 0;
    for (let i = 0; i < imgData.length; i += 4) {
      const avg = (imgData[i] + imgData[i+1] + imgData[i+2]) / 3;
      sum += avg;
    }
    const brightness = sum / (zone.width * zone.height);
    activityMap[zone.id] = brightness;
  });
  return activityMap;
};
