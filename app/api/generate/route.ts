import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Response } from 'openai/resources/responses/responses.mjs';

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) throw new Error('OPENAI_API_KEY is not set');

const client = new OpenAI({ apiKey });

export interface ImageResponseBase64 {
  outputText: string;
  image: string;
}

export async function POST(req: Request) {
  const { story } = await req.json();

  const completion = await sendWithLogging(async () => {
    return await client.responses.create({
      model: 'gpt-4.1-mini',
      input: prompt() + story,
      tools: [{ type: 'image_generation' }],
    });
  });

  return NextResponse.json<ImageResponseBase64>({
    outputText: completion.output_text ?? 'no output text was provided',
    image: 'data:image/png;base64,' + (completion.output[1] as { result: string }).result,
  });
}

function prompt(): string {
  return 'Please summarize the emotional tone of this story in a few sentences then generate a 512 x 512 image based on that summary: ';
}

async function sendWithLogging(func: () => Promise<Response>): Promise<Response> {
  console.log('Sending request to OpenAI');

  const intervalId = setInterval(() => console.log('Waiting for response...'), 5000);

  try {
    const result = await func();
    return result;
  } finally {
    clearInterval(intervalId);
  }
}

// TODO: adjust response to return image of lower quality and fixes smaller size in order to reduce token usage.
