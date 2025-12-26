require("dotenv").config()

const express = require("express")
const cors = require("cors")
const path = require("path")
const connectDB = require("./config/db.js")
const authRoutes = require("./routes/authRoutes.js")
const sessionRoutes = require("./routes/sessionRoutes.js")
const questionRoutes = require("./routes/questionRoutes.js")
const { protect } = require("./middlewares/authMiddleware.js")
const { generateInterviewQuestions, generateConceptExplanation } = require("./controllers/aiController.js")

const app = express()

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-type", "Authorization"]
    })
)

connectDB()

app.use(express.json())


app.use("/api/auth", authRoutes)
app.use("/api/sessions",sessionRoutes)
app.use("/api/questions",questionRoutes)

app.use("/api/ai/generate-questions",protect, generateInterviewQuestions)
app.use("/api/ai/generate-explanation",protect, generateConceptExplanation)

app.use("/upload", express.static(path.join(__dirname, "uploads"), {}))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => `Server running on port ${PORT}`);