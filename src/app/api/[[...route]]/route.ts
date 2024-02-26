import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";

import fetch from "node-fetch";
import { createOCRClient } from "tesseract-wasm/node";
import sharp from "sharp";

declare global {
  namespace NodeJS {
    interface Global {
      ocrClient: any;
      createOCTClient: any;
    }
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const app = new Hono().basePath('/api')

async function loadImage(buffer: Buffer) {
  const image = await sharp(buffer).ensureAlpha();
  const { width, height } = await image.metadata();
  return {
    data: await image.raw().toBuffer(),
    width,
    height,
  };
}

async function loadModel() {
  const modelPath = "eng.traineddata";
  if (!existsSync(modelPath)) {
    console.log("Downloading text recognition model...");
    const modelURL =
      "https://github.com/tesseract-ocr/tessdata_fast/raw/main/eng.traineddata";
    const response = await fetch(modelURL);
    if (!response.ok) {
      process.stderr.write(`Failed to download model from ${modelURL}`);
      process.exit(1);
    }
    const data = await response.arrayBuffer();
    await writeFile(modelPath, new Uint8Array(data));
  }
  return readFile("eng.traineddata");
}

app.get('/extract-image', (c) => {
  return c.json({
    message: 'Hello Next.js!',
  })
})

app.post('/ocr', async (c) => {
  const { file }: { file: string } = await c.req.parseBody()

  if (!file) {
    c.status(400)
    c.json({ message: 'No file found' })
  }

  // convert the file to a buffer for processing
  const client = createOCRClient()

  const base64Data = file.split(',')[1];

  // Crear un buffer a partir de la cadena base64
  const buffer = Buffer.from(base64Data, 'base64');

  try {
    const modelLoaded = loadModel().then((model) => client.loadModel(model));

    const image = await loadImage(buffer);

    await modelLoaded;
    await client.loadImage(image);
    const text = await client.getText();

    c.header("Content-Type", "application/json");

    return c.body(text, 201, { 'Content-Type': 'application/json' });

  } catch (err) {
    console.error(err);
    return c.json({ message: 'Error processing file' })
  } finally {
    // Shut down the OCR worker thread.
    client.destroy();
  }
});

export const GET = handle(app)
export const POST = handle(app)