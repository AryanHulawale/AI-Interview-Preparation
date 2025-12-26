// prompts.js

/**
 * Generates a prompt for the AI to produce technical interview questions and answers.
 * Ensures the AI strictly returns a valid JSON array.
 */
const questionAnswerPrompt = (role, experience, topicsToFocus, numberOfQuestions) => `
You are an AI trained to generate technical interview questions and answers.

Task:
- Role: ${role}
- Candidate Experience: ${experience} years
- Focus Topics: ${topicsToFocus}
- Generate exactly ${numberOfQuestions} interview questions.
- For each question, provide a detailed, beginner-friendly answer.
- If the answer requires a code example, include it **as plain text inside the answer**.
- Format the output as a **valid JSON array only**, following this structure:

[
  {
    "question": "Question text here?",
    "answer": "Answer text here. If code is included, use \\n for new lines."
  }
]

Strict Rules:
1. Return ONLY valid JSON.
2. No extra text before or after the JSON.
3. No markdown formatting, no triple backticks.
4. Use double quotes only.
5. No trailing commas.
6. Code examples must be plain text using \\n for line breaks.
7. Do not include any numbering or bullet points inside the JSON array.


Output Example:
[
  {
    "question": "What is React?",
    "answer": "React is a JavaScript library for building user interfaces.\\nIt allows creating reusable components and managing state efficiently."
  }
]
`;

  
/**
 * Generates a prompt for the AI to provide a detailed explanation of a single interview question.
 * Ensures the AI returns a strictly valid JSON object with title and explanation.
 */
const conceptExplainPrompt = (question) => `
Task: Explain "${question}" for a beginner developer.

Return a JSON object with:
1. "title": A short string.
2. "explanation": A long string containing markdown. 

Rules for the "explanation" field:
- Use markdown for headings (###) and lists.
- For code blocks, use triple backticks and the language name.
- IMPORTANT: You must escape all newlines as \\n.
- IMPORTANT: You must escape all double quotes inside the text as \\" to avoid breaking the JSON string.
- Do not add any text before or after the JSON.

Example Structure:
{
  "title": "Example Title",
  "explanation": "Line one.\\n\\n### Heading\\n\\n\`\`\`jsx\\nconst x = \\"hello\\";\\n\`\`\`"
}
`;

module.exports = { questionAnswerPrompt, conceptExplainPrompt };
