import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const summarizeAnswers = async (questionTitle, questionDescription, answers) => {
    const answersText = answers
        .map((a, i) => `Answer ${i + 1}: ${a}`)
        .join('\n\n');

    const prompt = `You are a developer Q&A assistant. A user is reading the following question and its answers on a developer forum. Write a concise plain-text summary (3–5 sentences) of the key points and solutions provided across all the answers. Do not use bullet points or markdown — plain text only.

Question Title: ${questionTitle}
Question Description: ${questionDescription}

Answers:
${answersText}`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
    });

    return response.text.trim();
};

export const improveQuestion = async (title, description, tags) => {
    const prompt = `You are a developer Q&A assistant. A user has drafted a question for a developer forum. Improve it by making the title clearer and more specific, the description more detailed and better structured, and the tags more relevant.

Return ONLY a valid JSON object with exactly these three keys: "title", "description", "tags". 
- "title": improved title string
- "description": improved description string  
- "tags": improved tags string (comma-separated, up to 5 tags)

User's draft:
Title: ${title}
Description: ${description}
Tags: ${tags}`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
    });

    const text = response.text.trim();

    // Strip markdown code fences if present
    const jsonText = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');

    const result = JSON.parse(jsonText);
    return {
        title: result.title || title,
        description: result.description || description,
        tags: result.tags || tags,
    };
};
