const express = require("express");
const cors = require("cors");
const multer = require("multer");
const OpenAI = require("openai");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Setup file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Initialize the OpenAI API with your API key
const openai = new OpenAI({
  apiKey: "sk-proj-hkPIWd6rBTtsGuIQoYm3T3BlbkFJeds72p2QYypFtfRcPf6T",
});

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: userMessage }],
      max_tokens: 150,
      temperature: 0.7,
    });

    const botResponse = chatCompletion.choices[0].message.content;

    res.json({ response: botResponse });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.json({ filePath: req.file.path });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
