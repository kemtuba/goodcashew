import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const curriculumPath = path.join(process.cwd(), "data", "curriculum.txt");
    const curriculumText = fs.readFileSync(curriculumPath, "utf-8");
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required." });
    }

    const prompt = `
      Based ONLY on the following text from a cashew farming curriculum, answer the user's question in a clear and simple way.
      If the answer is not in the text, say "I cannot find the answer in the provided curriculum."

      --- Curriculum Text Start ---
      ${curriculumText}
      --- Curriculum Text End ---

      Question: "${question}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ answer: text });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
}