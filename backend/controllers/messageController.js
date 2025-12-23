import imagekit from "../configs/imagekit.js";
import openai from "../configs/openai.js";
import Chat from "../models/chatschema.js";
import User from "../models/userschema.js";
import axios from "axios";

// text based ai chat message controller
export const textMessageController = async (req, res) => {
  let creditReserved = false;

  try {
    const userId = req.user.id;
    const { chatId, prompt } = req.body;

    if (!chatId || !prompt) {
      return res.status(400).json({
        success: false,
        message: "chatId and prompt are required",
      });
    }

    // rserve credit
    const creditResult = await User.updateOne(
      { _id: userId, credits: { $gt: 0 } },
      { $inc: { credits: -1 } }
    );

    if (creditResult.modifiedCount === 0) {
      return res.status(403).json({
        success: false,
        message: "Insufficient credits",
      });
    }

    creditReserved = true;

    // Check chat exists
    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) {
      throw new Error("Chat not found");
    }

    // Save user message
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    //  Call AI
  // 🔹 SSE headers
res.setHeader("Content-Type", "text/event-stream");
res.setHeader("Cache-Control", "no-cache");
res.setHeader("Connection", "keep-alive");

let fullAssistantMessage = "";

// 🔹 Stream AI response
const stream = await openai.chat.completions.create({
  model: "llama-3.1-8b-instant",
  stream: true,
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: prompt },
  ],
});

for await (const chunk of stream) {
  const token = chunk.choices[0]?.delta?.content;

  if (token) {
    fullAssistantMessage += token;

    // send chunk to frontend
    res.write(`data: ${token}\n\n`);
  }
}

// 🔹 Save assistant message AFTER streaming
const reply = {
  role: "assistant",
  content: fullAssistantMessage,
  timestamp: Date.now(),
  isImage: false,
};

chat.messages.push(reply);
await chat.save();

// 🔹 End stream
res.write("data: [DONE]\n\n");
res.end();

  } catch (error) {
    console.error("Text message error:", error);

    // Rollback credit if something failed
    if (creditReserved) {
      await User.updateOne({ _id: req.user.id }, { $inc: { credits: 1 } });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// image generation message controller

export const imageMessageController = async (req, res) => {
  let creditReserved = false;

  try {
    const userId = req.user.id;
    const { prompt, chatId, isPublished } = req.body;

    // check credits
    const creditResult = await User.updateOne(
      { _id: userId, credits: { $gte: 2 } },
      { $inc: { credits: -2 } }
    );

    if (creditResult.modifiedCount === 0) {
      return res.status(403).json({
        success: false,
        message: "You don't have enough credits to generate images",
      });
    }

    creditReserved = true;

    //find chat
    const chat = await Chat.findOne({ userId, _id: chatId });
    if (!chat) {
      throw new Error("Chat not found");
    }

    // push user message
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    //encode the prompt
    const encodedPromp = encodeURIComponent(prompt);

    //construct imagekit ai generation url
    const generatedImageURL = `${
      process.env.IMAGEKIT_URL_ENDPOINT
    }/ik-genimg-prompt-${encodedPromp}/sketchyAI/${Date.now()}.png?tr=w-800,h-800`;

    //image generation
    const aiImageResponse = await axios.get(generatedImageURL, {
      responseType: "arraybuffer",
    });

    //conv to base64
    const base64Image = `data:image/png;base64,${Buffer.from(
      aiImageResponse.data,
      "binary"
    ).toString("base64")}`;

    //upload to imageit library
    const uploadResponse = await imagekit.upload({
      file: base64Image,
      fileName: `${Date.now()}.png`,
      folder: "fetchyAI",
    });

    const reply = {
      role: "assistant",
      content: uploadResponse.url,
      timestamp: Date.now(),
      isImage: true,
      isPublished,
    };
    res.json({ success: true, reply });
    chat.messages.push(reply);
    await chat.save();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// get published images
export const getPublishedimages=async(req,res)=>{
  try {
    const publicMessageImages = await Chat.aggregate([
        {$unwind:"$messages"},
        {
          $match:{
            "messages.isImage":true,
            'messages.isPublished':true
          }
        },
        {
          $project:{
            _id:0,
            imageUrl:"$messages.content",
            userName:"$userName"
          }
        }
    ]);

    res.json({success:true,images:publicMessageImages.reverse()})
  } catch (error) {
    res.status(500).json({success:false,message:error.message})
  }

}


//  {
//         "_id": "689de4bbaa932dc3a8ef6cd7",
//         "userId": "689c6deed410acddc0d95a0e",
//         "userName": "GreatStack",
//         "name": "New Chat",
//         "messages": [
//             {
//                 "isImage": false,
//                 "isPublished": false,
//                 "role": "user",
//                 "content": "a boy running on water",
//                 "timestamp": 1755178179612,
//             },
//             {
//                 "isImage": true,
//                 "isPublished": true,
//                 "role": "assistant",
//                 "content": ai_image11,
//                 "timestamp": 1755178194747,
//             }
//         ],
//         "createdAt": "2025-08-14T13:29:31.398Z",
//         "updatedAt": "2025-08-14T13:29:54.753Z",
//     }
