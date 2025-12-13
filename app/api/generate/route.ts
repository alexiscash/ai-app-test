import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const apiKey: string | undefined = process.env.OPENAI_API_KEY;

const client = new OpenAI({ apiKey });

export async function POST(req: Request) {
  const { story } = await req.json();

  const completion = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: prompt() + story,
    tools: [{ type: 'image_generation' }],
  });

  console.log(completion);

  return NextResponse.json({
    outputText: completion.output_text,
  });
}

function prompt() {
  return 'Summarize the emotional tone of this story in 1 sentence then generate an image based on that summary: ';
}

// export async function POST(req: Request) {
//   const { story } = await req.json();

//   const completion = await client.responses.create({
//     model: 'gpt-4.1-mini',
//     input: 'Summarize the emotional tone of this story in 1 sentence: ' + story,
//   });

//   console.log(completion);

//   return NextResponse.json({
//     outputText: completion.output_text,
//   });
// }
