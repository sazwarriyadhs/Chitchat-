import { NextResponse } from 'next/server';
import ColorThief from 'colorthief';
import path from 'path';
import fs from 'fs/promises';

// Helper to convert RGB to HSL, which is better for theme manipulation
function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

// Function to adjust lightness of HSL color
function adjustLightness(hsl: number[], percentage: number) {
    const newLightness = Math.max(0, Math.min(100, hsl[2] + percentage));
    return `${hsl[0]} ${hsl[1]}% ${newLightness}%`;
}


export async function POST(request: Request) {
  const { imageUrl } = await request.json();

  if (!imageUrl) {
    return NextResponse.json({ error: 'imageUrl is required' }, { status: 400 });
  }

  try {
    let imageBuffer: Buffer;
    
    if (imageUrl.startsWith('data:image')) {
      // Handle Data URL
      const base64Data = imageUrl.split(',')[1];
      imageBuffer = Buffer.from(base64Data, 'base64');
    } else if (imageUrl.startsWith('/')) {
       // Handle local public file
       const filePath = path.join(process.cwd(), 'public', imageUrl);
       imageBuffer = await fs.readFile(filePath);
    } else {
       return NextResponse.json({ error: 'Invalid image URL format. Must be a local path or data URL.' }, { status: 400 });
    }

    const dominantColorRgb = await ColorThief.getColor(imageBuffer);
    
    if (!dominantColorRgb) {
        throw new Error('Could not extract dominant color.');
    }

    const dominantHsl = rgbToHsl(dominantColorRgb[0], dominantColorRgb[1], dominantColorRgb[2]);
    
    // Determine if the dominant color is dark or light
    const isDark = dominantHsl[2] < 50;

    // Create a theme based on the dominant color
    const primary = `${dominantHsl[0]} ${dominantHsl[1]}% ${dominantHsl[2]}%`;
    const primaryForeground = isDark ? '210 40% 98%' : '222.2 47.4% 11.2%';
    const accent = adjustLightness(dominantHsl, isDark ? 20 : -20);
    const accentForeground = isDark ? '210 40% 98%' : '222.2 47.4% 11.2%';
    

    return NextResponse.json({
        primary,
        primaryForeground,
        accent,
        accentForeground,
    });

  } catch (error: any) {
    console.error('Error processing image:', error);
    // Return a default theme on error
    return NextResponse.json({
        primary: '145 75% 38%',
        primaryForeground: '145 25% 98%',
        accent: '45 90% 55%',
        accentForeground: '45 30% 15%',
    }, { status: 200 });
  }
}