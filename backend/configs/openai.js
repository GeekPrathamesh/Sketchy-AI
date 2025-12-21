import OpenAI from "openai";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export default groq;



// const response = await openai.chat.completions.create({
//     model: "gemini-2.0-flash",
//     messages: [
//         { role: "system", content: "You are a helpful assistant." },
//         {
//             role: "user",
//             content: "Explain to me how AI works",
//         },
//     ],
// });

// console.log(response.choices[0].message);