import { improveQuestion, summarizeAnswers } from '../services/aiService.js';
import { createAppError } from '../utils/createAppError.js';

export const improveQuestionHandler = async (req, res, next) => {
    try {
        const { title, description, tags } = req.body;

        if (!title && !description) {
            throw createAppError('Title and description are required.', 400);
        }

        const suggestions = await improveQuestion(
            title || '',
            description || '',
            tags || ''
        );

        res.status(200).json({ status: 'success', data: suggestions });
    } catch (error) {
        next(error);
    }
};

export const summarizeAnswersHandler = async (req, res, next) => {
    try {
        const { questionTitle, questionDescription, answers } = req.body;

        if (!questionTitle || !Array.isArray(answers) || answers.length < 3) {
            throw createAppError('questionTitle and at least 3 answers are required.', 400);
        }

        const summary = await summarizeAnswers(
            questionTitle,
            questionDescription || '',
            answers
        );

        res.status(200).json({ status: 'success', data: { summary } });
    } catch (error) {
        next(error);
    }
};
