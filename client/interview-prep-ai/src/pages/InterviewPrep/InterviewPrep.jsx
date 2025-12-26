import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";
import { LuCircleAlert, LuListCollapse } from "react-icons/lu";
import { toast } from "react-hot-toast";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import RoleInfoHeader from "./components/RoleInfoHeader";
import QuestionCard from "../../components/Cards/QuestionCard";
import Drawer from "../../components/Drawer";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import AIResponsePreview from "./components/AIResponsePreview";

const InterviewPrep = () => {
  const { sessionId } = useParams();

  const [sessionData, setSessionData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [openLearnMoreDrawer, setOpenLearnMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const fetchSessionDetailsById = async () => {
    try {
      const res = await axiosInstance.get(
        API_PATHS.SESSION.GET_ONE(sessionId)
      );

      if (res.data?.session) {
        setSessionData(res.data.session);
      }
    } catch (err) {
      console.error("Fetch session error:", err);
    }
  };

  const generateConceptExplanation = async (question) => {
    try {
      setErrorMsg("");
      setExplanation(null);
      setIsLoading(true);
      setOpenLearnMoreDrawer(true);

      const res = await axiosInstance.post(
        API_PATHS.AI.GENERATE_EXPLANATION,
        { question }
      );

      if (res.data) {
        setExplanation(res.data);
      }
    } catch (err) {
      setErrorMsg("Failed to generate explanation. Try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };


  const toggleQuestionPinStatus = async (questionId) => {
    try {
      // optimistic UI update
      setSessionData((prev) => ({
        ...prev,
        questions: prev.questions.map((q) =>
          q._id === questionId
            ? { ...q, isPinned: !q.isPinned }
            : q
        ),
      }));

      const res = await axiosInstance.post(
        API_PATHS.QUESTION.PIN(questionId),
        { sessionId }
      );

      if (res.data?.success) {
        toast.success("Question pin updated");
        fetchSessionDetailsById();
      }
    } catch (err) {
      toast.error("Failed to update pin");
      console.error("Pin error:", err);
      fetchSessionDetailsById(); // rollback
    }
  };

  const uploadMoreQuestions = async () => {
    try {

      setIsLoading(true)

      const aiResponse = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {
        role: sessionData?.role,
        experience: sessionData?.experience,
        topicsToFocus: sessionData?.topicsToFocus,
        numberOfQuestions: 10,
      })

      const generatedQuestions = aiResponse.data;

      // Ensure proper format before sending to backend
      const questions = generatedQuestions
        .map(q => ({
          question: typeof q.question === "string" ? q.question : q.questionText || "",
          answer: typeof q.answer === "string" ? q.answer : q.answerText || "",
        }))
        .filter(q => q.question && q.answer); // remove invalid entries



      const response = await axiosInstance.post(API_PATHS.QUESTION.ADD_TO_SESSION, {
        sessionId,
        questions
      })

      if (response.data) {
        toast.success("Added More Q&A!!")
        fetchSessionDetailsById()
      }


    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorMsg(error.response.data.message)
      } else {
        setErrorMsg("Something went wrong, Please try again later")
      }

    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetailsById();
    }
  }, [sessionId]);

  return (
    <DashboardLayout>
      <RoleInfoHeader
        role={sessionData?.role || ""}
        topicsToFocus={sessionData?.topicsToFocus || ""}
        experience={sessionData?.experience || "-"}
        questions={sessionData?.questions?.length || "-"}
        description={sessionData?.description || ""}
        lastUpdated={
          sessionData?.updatedAt
            ? moment(sessionData.updatedAt).format("Do MMM YYYY")
            : ""
        }
      />

      <div className="container mx-auto pb-6 pt-6 px-6 ">
        <h2 className="text-lg font-semibold">Interview Q & A</h2>

        <div className="grid grid-cols-12 gap-4 mt-5 mb-10">
          <div
            className={`col-span-12 ${openLearnMoreDrawer ? "md:col-span-7" : "md:col-span-8"
              }`}
          >
            <AnimatePresence>
              {sessionData?.questions?.map((q, index) => (
                <motion.div
                  key={q._id}
                  className="group"   // 🔥 FIXED GROUP HOVER
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.4,
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                    delay: index * 0.05,
                  }}
                  layout
                >
                  <>
                    <QuestionCard
                      question={q.question}
                      answer={q.answer}
                      isPinned={q.isPinned}
                      onLearnMore={() =>
                        generateConceptExplanation(q.question)
                      }
                      onTogglePin={() =>
                        toggleQuestionPinStatus(q._id)
                      }
                    />

                    {!isLoading &&
                      sessionData?.questions?.length == index + 1 && (
                        <div className="flex items-center justify-center mt-5">
                          <button
                            className="flex items-center gap-3 text-sm text-white font-medium bg-black px-5 py-2 mr-2 rounded text-nowrap cursor-pointer"
                            disabled={isLoading}
                            onClick={uploadMoreQuestions}
                          >
                            {isLoading ? (
                              <SpinnerLoader />
                            ) : (
                              <LuListCollapse className="text-lg" />
                            )}{" "}
                            Load More
                          </button>
                        </div>
                      )}
                  </>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <Drawer
          isOpen={openLearnMoreDrawer}
          onClose={() => setOpenLearnMoreDrawer(false)}
          title={!isLoading && explanation?.title}
        >
          {isLoading && <SpinnerLoader />}

          {errorMsg && (
            <p className="flex gap-2 text-sm text-amber-600 font-medium">
              <LuCircleAlert className="mt-1" />
              {errorMsg}
            </p>
          )}

          {!isLoading && explanation && (
            <AIResponsePreview content={explanation.explanation} />
          )}
        </Drawer>
      </div>
    </DashboardLayout>
  );
};

export default InterviewPrep;
