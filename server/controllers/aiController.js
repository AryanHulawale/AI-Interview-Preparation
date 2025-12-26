const Groq = require("groq-sdk");
const { conceptExplainPrompt, questionAnswerPrompt } = require("../utils/prompts.js");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// aiController.js

// aiController.js

const safeParseJSON = (text) => {
  if (!text) return null;

  try {
    // 1. Remove Markdown wrappers if present (```json ... ```)
    let cleaned = text.trim();
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/```\s*$/i, "");

    // 2. Try standard parse
    return JSON.parse(cleaned);
  } catch (e) {
    try {
      // 3. FALLBACK: Manual string sanitization
      // This identifies the boundaries of the JSON object
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      if (start === -1 || end === -1) return null;

      let rawContent = text.substring(start, end + 1);

      // This regex looks for the "explanation": "..." part and 
      // replaces internal literal newlines with \n
      const fixedContent = rawContent.replace(/"explanation":\s*"([\s\S]*?)"\s*}/, (match, p1) => {
        const escaped = p1
          .replace(/\n/g, "\\n")      // Fix literal newlines
          .replace(/\r/g, "\\r")      // Fix carriage returns
          .replace(/(?<!\\)"/g, '\\"'); // Fix unescaped double quotes
        return `"explanation": "${escaped}"}`;
      });

      return JSON.parse(fixedContent);
    } catch (innerError) {
      console.error("Manual recovery failed:", innerError.message);
      return null;
    }
  }
};

// Controller: Generate Interview Questions
const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a technical educator. You must always respond with a single, valid JSON object. Do not include any text outside the JSON."
        },
        { role: "user", content: prompt }
      ],
      // This is the most important line:
      response_format: { type: "json_object" },
      max_tokens: 2000,
      temperature: 0.1,
    });

    const rawText = completion?.choices?.[0]?.message?.content;

    if (!rawText) {
      return res.status(500).json({ message: "No response from AI model" });
    }

    const data = safeParseJSON(rawText, "array");

    if (!data) {
      console.error("FAILED TO PARSE AI JSON:", rawText);
      return res.status(500).json({
        message: "Failed to parse AI response as JSON array",
        rawText
      });
    }

    res.status(200).json(data);

  } catch (error) {
    console.error("AI GENERATION ERROR:", error);
    res.status(500).json({
      message: "Failed to generate questions",
      error: error.message
    });
  }
};

// Controller: Generate Concept Explanation
const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = conceptExplainPrompt(question);

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a technical educator. You must always respond with a single, valid JSON object. Do not include any text outside the JSON."
        },
        { role: "user", content: prompt }
      ],
      // This is the most important line:
      response_format: { type: "json_object" },
      max_tokens: 2000,
      temperature: 0.1,
    });

    const rawText = completion?.choices?.[0]?.message?.content;

    if (!rawText) {
      return res.status(500).json({ message: "No explanation received from AI model" });
    }

    const data = safeParseJSON(rawText, "object");

    if (!data) {
      console.error("FAILED TO PARSE AI EXPLANATION JSON:", rawText);
      return res.status(500).json({
        message: "Failed to parse AI explanation response",
        rawText
      });
    }

    res.status(200).json({ success: true, ...data });

  } catch (error) {
    console.error("AI EXPLANATION ERROR:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};

module.exports = {
  generateInterviewQuestions,
  generateConceptExplanation
};
