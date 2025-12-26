const express = require("express")
const { protect } = require("../middlewares/authMiddleware.js")
const {
  createSession,
  getSessionById,
  getMySessions,
  deleteSession
} = require("../controllers/sessionController.js")

const router = express.Router()

router.post("/create", protect, createSession)
router.get("/my-sessions", protect, getMySessions)
router.get("/:id", protect, getSessionById)
router.delete("/:id", protect, deleteSession)

module.exports = router
