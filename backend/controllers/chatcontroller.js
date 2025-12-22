import Chat from "../models/chatschema.js";

// api controller to create the new chat

export const createChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const chatData = {
      userId,
      messages: [],
      name: "Initialize the new chat..",
      userName: req.user.name,
    };

    await Chat.create(chatData);
    res.status(201).json({ success: true, message: "Chat Created" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// api controller to get the user all chat

export const getChats = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({ userId })
      .sort({ updatedAt: -1 }) // gives in descending order
      .lean();

    res.status(200).json({
      success: true,
      chats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// api controller to delete specific chat

export const deleteChats = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId } = req.params;

    const result = await Chat.deleteOne({ _id: chatId, userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Chat Deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
