import axiosInstance from "../api/axiosInstance.js";
import { ANSWER_API } from "../config/config.js";

export const createAnswerForQuestion = async (questionId, answerText, token) => {
  const res = await axiosInstance.post(
    ANSWER_API.CREATE_FOR_QUESTION(questionId),
    { answerText },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data.data;
};

export const upvoteAnswer = async (answerId, token) => {
  const res = await axiosInstance.post(
    ANSWER_API.UPVOTE(answerId),
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data.data;
};

export const downvoteAnswer = async (answerId, token) => {
  const res = await axiosInstance.post(
    ANSWER_API.DOWNVOTE(answerId),
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data.data;
};
