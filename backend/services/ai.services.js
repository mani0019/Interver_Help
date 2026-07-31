const axios = require("axios")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")



const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})


async function generateInterviewReport({ resume, selfDescription, jobDescription }) {


    const prompt = `
You are an experienced Technical Recruiter and Software Engineering Interviewer.

Analyze the candidate's profile against the given Job Description and generate a professional interview report.

Rules:
- Return ONLY valid JSON.
- Do NOT include markdown, explanations, or code fences.
- matchScore MUST be an integer between 0 and 100.
- Calculate the score based on skills, projects, experience, education, and overall relevance.
- If the candidate matches most required skills, the score should normally be above 80.
- Only list skill gaps that are mentioned or clearly implied in the Job Description.
- Do NOT invent missing skills.

Generate:

1. Match Score
- Integer between 0 and 100.

2. Technical Questions
- Generate exactly 3 technical interview questions.
- Each question must include:
  - question
  - intention
  - answer
- The answer must be detailed (80-150 words) and MUST NOT be empty.

3. Behavioral Questions
- Generate exactly 3 behavioral interview questions.
- Each question must include:
  - question
  - intention
  - answer
- The answer must be detailed (50-80 words) and MUST NOT be empty.

4. Skill Gaps
- Return a maximum of 3 skill gaps.
- Include only skills missing from the Job Description.
- If there are no important gaps, return an empty array.

5. Preparation Plan
Generate a practical 5-day interview preparation roadmap.

Each day should include:
- day
- focus
- 3 to 5 practical tasks

6. Title
Return the job title based on the Job Description.

Return this exact JSON format:

{
  "matchScore": number,
  "technicalQuestions": [
    {
      "question": "",
      "intention": "",
      "answer": ""
    }
  ],
  "behavioralQuestions": [
    {
      "question": "",
      "intention": "",
      "answer": ""
    }
  ],
  "skillGaps": [
    {
      "skill": "",
      "severity": "low"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "",
      "tasks": [
        ""
      ]
    }
  ],
  "title": ""
}

Candidate Information

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Return ONLY valid JSON.
`;

    const response = await axios.post(
  "https://integrate.api.nvidia.com/v1/chat/completions",
  {
    model: "nvidia/llama-3.3-nemotron-super-49b-v1",

    messages: [
      {
        role: "user",
        content: prompt
      }
    ],

    temperature: 0.2,
    max_tokens: 2048,
    stream: false
  },

  {
    headers: {
    Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
    "Content-Type": "application/json",
    Accept: "application/json"
}
  }
)
   const content = response.data.choices[0].message.content
   console.log("Raw AI Response:", content)



const cleaned = content
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim()

try {
    return JSON.parse(cleaned);
} catch (err) {
    console.log(cleaned);
    throw new Error("AI returned invalid JSON.");
}


}



async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `
Create a professional ATS-friendly resume tailored to the following job.

Candidate Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Requirements:
- Return ONLY valid JSON.
- Do not use markdown.
- Do not use code fences.
- Do not include explanations.

Generate a professional HTML resume.

Rules:
- Simple HTML only.
- Inline CSS only.
- No JavaScript.
- No SVG.
- No icons.
- No images.
- No gradients.
- No external fonts.
- White background.
- Black text.
- Maximum one page.
- Keep the HTML concise.

Return ONLY this JSON:

{
  "html": "<html>...</html>"
}
`;

const response = await axios.post(
    "https://integrate.api.nvidia.com/v1/chat/completions",
    {
        model: "meta/llama-3.1-8b-instruct",
        messages: [
            {
                role: "user",
                content: prompt
            }
        ],
        temperature: 0.15,
        top_p: 0.9,
        max_tokens: 1100,
        stream: false
    },
    {
        headers: {
            Authorization: `Bearer ${process.env.NVIDIA_API_KEY_2}`,
            "Content-Type": "application/json",
            Accept: "application/json"
        }
    }
);


    const rawContent = response.data.choices[0].message.content


const cleanedContent = rawContent
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

const start = cleanedContent.indexOf("{");
const end = cleanedContent.lastIndexOf("}");

if (start === -1 || end === -1) {
    console.log(cleanedContent);
    throw new Error("No JSON object found.");
}

let jsonContent;

try {
    jsonContent = JSON.parse(
        cleanedContent.substring(start, end + 1)
    );
} catch (err) {
    console.log("========== RAW AI RESPONSE ==========");
    console.log(cleanedContent);
    console.log("=====================================");
    throw new Error("Invalid JSON returned by AI.");
}
if (!jsonContent.html) {
    throw new Error("AI did not return HTML.");
}

if (!jsonContent.html.includes("<html")) {
    throw new Error("Returned HTML is incomplete.");
}

const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

return pdfBuffer

}

module.exports = { generateInterviewReport, generateResumePdf }