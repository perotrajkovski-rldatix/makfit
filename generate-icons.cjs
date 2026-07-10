const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const iconPath = path.join(__dirname, 'public', 'icon.svg');
const resPath = path.join(__dirname, 'android', 'app', 'src', 'main', 'res');
const iosSplashPath = path.join(__dirname, 'ios', 'App', 'App', 'Assets.xcassets', 'Splash.imageset');

const iconSizes = [
  { folder: 'mipmap-mdpi', size: 48 },
  { folder: 'mipmap-hdpi', size: 72 },
  { folder: 'mipmap-xhdpi', size: 96 },
  { folder: 'mipmap-xxhdpi', size: 144 },
  { folder: 'mipmap-xxxhdpi', size: 192 },
];

async function generateIcons() {
  if (!fs.existsSync(iconPath)) {
    console.error('Icon not found at:', iconPath);
    return;
  }

  for (const { folder, size } of iconSizes) {
    const dir = path.join(resPath, folder);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Standard icon
    await sharp(iconPath)
      .resize(size, size)
      .toFile(path.join(dir, 'ic_launcher.png'));

    // Round icon
    const radius = size / 2;
    const circleSvg = Buffer.from(
      `<svg><circle cx="${radius}" cy="${radius}" r="${radius}" /></svg>`
    );

    await sharp(iconPath)
      .resize(size, size)
      .composite([{ input: circleSvg, blend: 'dest-in' }])
      .toFile(path.join(dir, 'ic_launcher_round.png'));

    // Foreground for adaptive icons
    const adaptiveSize = Math.round((size / 48) * 108);
    await sharp(iconPath)
      .resize(adaptiveSize, adaptiveSize)
      .toFile(path.join(dir, 'ic_launcher_foreground.png'));
    
    // Create a solid green background for adaptive icons
    // Using the green color from your image (approx #00c896)
    await sharp({
      create: {
        width: adaptiveSize,
        height: adaptiveSize,
        channels: 4,
        background: { r: 0, g: 200, b: 150, alpha: 1 }
      }
    })
    .png()
    .toFile(path.join(dir, 'ic_launcher_background.png'));
    
    console.log(`Generated icons for ${folder}`);
  }
}

const androidSplashTargets = [
  'drawable',
  'drawable-land-mdpi',
  'drawable-land-hdpi',
  'drawable-land-xhdpi',
  'drawable-land-xxhdpi',
  'drawable-land-xxxhdpi',
  'drawable-port-mdpi',
  'drawable-port-hdpi',
  'drawable-port-xhdpi',
  'drawable-port-xxhdpi',
  'drawable-port-xxxhdpi',
];

async function generateSplashes() {
  if (!fs.existsSync(iconPath)) {
    console.error('Icon not found at:', iconPath);
    return;
  }

  // Android splash variants.
  for (const folder of androidSplashTargets) {
    const dir = path.join(resPath, folder);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await sharp(iconPath)
      .resize(2732, 2732, { fit: 'cover' })
      .png()
      .toFile(path.join(dir, 'splash.png'));
  }

  // iOS splash variants used by Splash.imageset.
  if (!fs.existsSync(iosSplashPath)) {
    fs.mkdirSync(iosSplashPath, { recursive: true });
  }

  const iosSplashFiles = [
    'splash-2732x2732.png',
    'splash-2732x2732-1.png',
    'splash-2732x2732-2.png',
  ];

  for (const fileName of iosSplashFiles) {
    await sharp(iconPath)
      .resize(2732, 2732, { fit: 'cover' })
      .png()
      .toFile(path.join(iosSplashPath, fileName));
  }

  console.log('Generated splash images from public/icon.svg');
}

Promise.all([generateIcons(), generateSplashes()]).catch(console.error);
