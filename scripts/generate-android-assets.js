import { Jimp } from 'jimp';
import fs from 'fs';
import path from 'path';

const sourceImage = path.resolve('public/pwa-512x512.png');
const resDir = path.resolve('android/app/src/main/res');

const iconSizes = [
  { folder: 'mipmap-mdpi', size: 48 },
  { folder: 'mipmap-hdpi', size: 72 },
  { folder: 'mipmap-xhdpi', size: 96 },
  { folder: 'mipmap-xxhdpi', size: 144 },
  { folder: 'mipmap-xxxhdpi', size: 192 },
];

const splashSizes = [
  { folder: 'drawable', width: 512, height: 512 },
  { folder: 'drawable-port-mdpi', width: 320, height: 480 },
  { folder: 'drawable-port-hdpi', width: 480, height: 800 },
  { folder: 'drawable-port-xhdpi', width: 720, height: 1280 },
  { folder: 'drawable-port-xxhdpi', width: 960, height: 1600 },
  { folder: 'drawable-port-xxxhdpi', width: 1280, height: 1920 },
  { folder: 'drawable-land-mdpi', width: 480, height: 320 },
  { folder: 'drawable-land-hdpi', width: 800, height: 480 },
  { folder: 'drawable-land-xhdpi', width: 1280, height: 720 },
  { folder: 'drawable-land-xxhdpi', width: 1600, height: 960 },
  { folder: 'drawable-land-xxxhdpi', width: 1920, height: 1280 },
];

async function generateAssets() {
  console.log('Generating Android assets from public/pwa-512x512.png...');
  const image = await Jimp.read(sourceImage);

  // Generate Icons
  for (const item of iconSizes) {
    const targetDir = path.join(resDir, item.folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const resized = image.clone().resize({ w: item.size, h: item.size });
    await resized.write(path.join(targetDir, 'ic_launcher.png'));
    await resized.write(path.join(targetDir, 'ic_launcher_round.png'));
    await resized.write(path.join(targetDir, 'ic_launcher_foreground.png'));
    console.log(`Generated ${item.folder} icons (${item.size}x${item.size})`);
  }

  // Generate Splash Screens
  for (const item of splashSizes) {
    const targetDir = path.join(resDir, item.folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const resized = image.clone().resize({ w: item.width, h: item.height });
    await resized.write(path.join(targetDir, 'splash.png'));
    console.log(`Generated ${item.folder} splash (${item.width}x${item.height})`);
  }

  console.log('✅ Android assets successfully generated!');
}

generateAssets().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
