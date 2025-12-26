const express = require("express")
const { protect } = require("../middlewares/authMiddleware")
const { addQuestionsToSession,
    toggleQuestionPin,
    updateQuestionNote } = require("../controllers/questionController.js")

const router = express.Router()

router.post("/add", protect, addQuestionsToSession)
router.post("/:id/pin", protect, toggleQuestionPin)
router.post("/:id/note", protect, updateQuestionNote)


module.exports = router