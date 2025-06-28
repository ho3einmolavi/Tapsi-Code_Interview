const fs = require('fs');
const readline = require('readline');
const { OpenAI } = require('openai');

const transcriptChunks = require('./transcript.json');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
let embeddedChunks = [];

// 🔹 Get Embeddings using OpenAI
async function getEmbedding(text) {
  const res = await openai.embeddings.create({
    model: 'text-embedding-3-small', // Or use 'text-embedding-ada-002'
    input: Array.isArray(text) ? text : [text]
  });
  console.log({res, text})
  return res.data.map(d => d.embedding);
}

// 🔹 Preprocess transcript
async function embedChunks() {
  console.log("📚 Embedding transcript...");
  const embeddings = await getEmbedding(transcriptChunks);
  embeddedChunks = embeddings.map((embedding, i) => ({
    embedding,
    text: transcriptChunks[i]
  }));
}

// 🔹 Cosine Similarity
function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (normA * normB);
}

// 🔹 Chat Prompting
async function askQuestion(question) {
  const [queryEmbedding] = await getEmbedding(question);

  const topChunks = embeddedChunks
    .map(chunk => ({
      text: chunk.text,
      score: cosineSimilarity(queryEmbedding, chunk.embedding)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const context = topChunks.map(c => `- ${c.text}`).join('\n');


  const prompt = `You are a helpful assistant. Use the transcript snippets below to answer the question.\n\nTranscript:\n${context}\n\nQuestion: ${question}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4', // or 'gpt-3.5-turbo'
    messages: [{ role: "user", content: prompt }]
  });

  console.log("\n🤖 Answer:\n", completion.choices[0].message.content);
}

// 🔹 CLI Loop
async function startChat() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const ask = (q) => new Promise(resolve => rl.question(q, resolve));

  await embedChunks();

  while (true) {
    const userInput = await ask("\n❓ Your question (or 'exit'): ");
    if (userInput.toLowerCase() === 'exit') {
      rl.close();
      console.log("👋 Goodbye!");
      break;
    }
    await askQuestion(userInput);
  }
}

startChat();
