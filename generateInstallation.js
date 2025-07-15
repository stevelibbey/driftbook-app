const fs = require('fs');
const path = require('path');

const folderPath = './public/images/oozy-seq'; // Change this to your image folder
const outputSlug = 'oozy';
const outputTitle = 'Oozy';
const basePath = '/images/oozy-seq'; // Public path used in the app
const outputFile = './public/installations.json'; // Change if needed

const generateInstallation = (folder) => {
  const files = fs
    .readdirSync(folder)
    .filter(file => /\.(png|jpg|jpeg|gif)$/i.test(file))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const images = files.map(file => path.join(basePath, file));

  return {
    title: outputTitle,
    slug: outputSlug,
    fps: 6,
    images
  };
};

const saveInstallation = (installation) => {
  let data = { installations: [] };

  if (fs.existsSync(outputFile)) {
    const raw = fs.readFileSync(outputFile, 'utf-8');
    try {
      data = JSON.parse(raw);
    } catch (err) {
      console.error('Error parsing existing installations.json:', err);
      return;
    }
  }

  const exists = data.installations.some(inst => inst.slug === outputSlug);
  if (exists) {
    console.log(`Installation with slug "${outputSlug}" already exists. Skipping.`);
    return;
  }

  data.installations.push(installation);
  fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
  console.log(`Installation "${outputTitle}" added successfully.`);
};

const installation = generateInstallation(folderPath);
saveInstallation(installation);
