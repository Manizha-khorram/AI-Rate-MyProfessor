import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { HfInference } from "@huggingface/inference";
import { ReadableStream } from "web-streams-polyfill/ponyfill";
import Groq from "groq-sdk";

const systemPrompt = `
System Prompt: RateMyProfessor Agent
Objective: Assist students in finding the top professors based on their queries by leveraging Retrieval-Augmented Generation (RAG) techniques.
Instructions:
... (rest of the system prompt)
`;

// Initialize Groq API

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
export async function POST(req) {
  try {
    const data = await req.json();

    // Initialize Pinecone and Hugging Face Inference API
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

    const index = pc.index("rag").namespace("ns1");
    const text = data[data.length - 1].content;

    // Generate embedding using Hugging Face
    const embeddingResponse = await hf.featureExtraction({
      model: "intfloat/multilingual-e5-large",
      inputs: text,
      encoding_format: "float",
    });

    const embeddingVector = embeddingResponse;

    if (!embeddingVector || !embeddingVector.length) {
      throw new Error("Invalid or empty embedding vector.");
    }

    // Query Pinecone
    const results = await index.query({
      vector: embeddingVector,
      topK: 3,
      includeMetadata: true,
    });
    console.log("result", results);
    // Process the results
    let resultString =
      "\n\nReturned results from vector db (done automatically with rag): ";
    if (results?.matches) {
      results.matches.forEach((match) => {
        resultString += `\n
          Professor: ${match.id}, 
          Subject: ${match.metadata?.subject || "N/A"}, 
          Stars: ${match.metadata?.stars || "N/A"}, 
          Review: ${match.metadata?.review || "N/A"},
          \n\n`;
      });
    }

    const lastMessage = data[data.length - 1];
    const lastMessageContent = lastMessage.content + resultString;
    const lastDataWithoutLastMessage = data.slice(0, data.length - 1);

    // Request completion from Groq API
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: systemPrompt + "\n" + lastMessageContent,
        },
      ],
      model: "mixtral-8x7b-32768",
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          const content =
            completion.choices[0]?.message?.content || "No response";
          const text = encoder.encode(content);
          controller.enqueue(text);
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream);
  } catch (err) {
    console.error("Error in POST /api/chat:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
