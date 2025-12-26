const Session = require("../models/Session.js")
const Question = require("../models/Question.js")
const createSession = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, description, questions } = req.body;

    // ✅ SAFETY CHECKS
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Questions must be a non-empty array"
      });
    }

    const session = await Session.create({
      user: req.user._id,
      role,
      experience,
      topicsToFocus,
      description,
      numberOfQuestions:10
    });

    const questionDocs = await Question.insertMany(
      questions.map(q => ({
        session: session._id,
        question: q.question,
        answer: q.answer
      }))
    );

    session.questions = questionDocs.map(q => q._id);
    await session.save();

    res.status(201).json({ success: true, session });

  } catch (error) {
    console.error("CREATE SESSION ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};



const getMySessions = async (req, res) => {
    try {
        const sessions = await Session.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate("questions")

        res.status(200).json({ success: true, sessions })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server Error", success: false })
    }
}



const getSessionById = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id)
            .populate({
                path: "questions",
                options: { sort: { isPinned: -1, createdAt: 1 } }
            })
            .exec()

        if (!session) {
            return res.status(404).json({ success: false, message: "Session not found." })
        }

        res.status(200).json({ success: true, session })
    } catch (error) {
        console.error("Get session by ID error:", error) // ✅ logging added
        res.status(500).json({ message: "Server Error", success: false })
    }
}


const deleteSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id)

        if (!session) {
            return res.status(404).json({ success: false, message: "Session not found." })
        }

        // ✅ FIXED: ObjectId comparison bug
        if (session.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "You are not authorised to delete this session."
            })
        }

        await Question.deleteMany({ session: session._id })
        await session.deleteOne()

        res.status(201).json({ message: "Session deleted successfully" })
    } catch (error) {
        console.error("Delete session error:", error) // ✅ logging added
        res.status(500).json({ message: "Server Error", success: false })
    }
}

module.exports = {
    createSession,
    getSessionById,
    getMySessions,
    deleteSession
}
