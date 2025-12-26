const Session = require("../models/Session.js")
const Question = require("../models/Question.js")

// 1️⃣ ADD MULTIPLE QUESTIONS TO SESSION
const addQuestionsToSession = async (req, res) => {
    try {
        const { sessionId, questions } = req.body

        if (!sessionId || !Array.isArray(questions)) {
            return res.status(400).json({ success: false, message: "Invalid input data." })
        }

        const session = await Session.findById(sessionId)
        if (!session) {
            return res.status(404).json({ success: false, message: "Session not found." })
        }

        const createdQuestions = await Question.insertMany(
            questions.map((q) => ({
                session: sessionId,
                question: q.question,
                answer: q.answer,
            }))
        )

        session.questions.push(...createdQuestions.map(q => q._id))
        await session.save()

        res.status(201).json({ success: true, questions: createdQuestions })
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" })
    }
}

// 2️⃣ PIN / UNPIN QUESTION
const toggleQuestionPin = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id)

        if (!question) {
            return res.status(404).json({ success: false, message: "Question not found" })
        }

        question.isPinned = !question.isPinned
        await question.save()

        res.status(200).json({ success: true, question })
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" })
    }
}

// 3️⃣ UPDATE QUESTION NOTE
const updateQuestionNote = async (req, res) => {
    try {
        const { note } = req.body

        const question = await Question.findById(req.params.id)
        if (!question) {
            return res.status(404).json({ success: false, message: "Question not found" })
        }

        question.note = note || ""
        await question.save()

        res.status(200).json({ success: true, question })
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" })
    }
}

module.exports = {
    addQuestionsToSession,
    toggleQuestionPin,
    updateQuestionNote
}
