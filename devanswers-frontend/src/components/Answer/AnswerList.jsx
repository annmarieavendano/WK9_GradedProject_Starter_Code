import { useState } from 'react';
import { Card, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaUser, FaClock, FaRobot } from 'react-icons/fa';
import { voteAnswer } from '../../reducers/questionSlice';
import { summarizeAnswers } from '../../services/aiService';
import { formatDate } from '../../utils/timeFormat';
import VoteButtons from '../Shared/VoteButtons';
import './AnswerList.css';

const AnswerList = ({ answers, question }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.userInfo?.token);

  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState(null);

  const isLoggedIn = !!token;
  const showSummarizeBtn = isLoggedIn && (answers?.length || 0) >= 3 && !summary;

  const handleSummarize = async () => {
    setSummaryError(null);
    setSummaryLoading(true);
    try {
      const answerTexts = answers.map((a) => a.answerText);
      const result = await summarizeAnswers(
        {
          questionTitle: question?.title || '',
          questionDescription: question?.description || '',
          answers: answerTexts,
        },
        token
      );
      setSummary(result);
    } catch (err) {
      setSummaryError(err.response?.data?.message || 'Failed to generate summary. Please try again.');
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleDismissSummary = () => {
    setSummary(null);
    setSummaryError(null);
  };

  return (
    <Card className="alist-card">
      <Card.Body className="p-3">
        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
          <h4 className="mb-0 alist-title">
            {answers?.length || 0} {answers?.length === 1 ? 'Answer' : 'Answers'}
          </h4>
          {showSummarizeBtn && (
            <Button
              variant="outline-primary"
              size="sm"
              className="alist-summarize-btn"
              onClick={handleSummarize}
              disabled={summaryLoading}
            >
              {summaryLoading ? (
                <><Spinner size="sm" className="me-1" />Summarizing...</>
              ) : (
                <><FaRobot className="me-1" />Summarize Answers</>
              )}
            </Button>
          )}
        </div>

        {summaryError && (
          <Alert variant="danger" dismissible onClose={() => setSummaryError(null)} className="mb-3">
            {summaryError}
          </Alert>
        )}

        {summary && (
          <Alert variant="info" dismissible onClose={handleDismissSummary} className="alist-summary-banner mb-3">
            <strong className="d-block mb-1"><FaRobot className="me-1" />AI Summary</strong>
            {summary}
          </Alert>
        )}

        {answers && answers.length > 0 ? (
          answers.map((answer) => (
            <Card
              key={answer._id}
              className="mb-1 alist-answer-card"
            >
              <Card.Body className="p-2">
                <Row>
                  {/* Voting Controls */}
                  <Col xs="auto" className="d-flex flex-column align-items-center align-self-start pe-3">
                    <VoteButtons
                      voteCount={answer.voteCount}
                      authorId={answer.author?._id}
                      onVote={(voteType) => dispatch(voteAnswer({ answer, voteType }))}
                      variant="outline-secondary"
                      upClassName="alist-vote-btn alist-vote-btn-up"
                      downClassName="alist-vote-btn alist-vote-btn-down"
                      countClassName="alist-vote-count"
                      upIconClassName="alist-icon-up"
                      downIconClassName="alist-icon-down"
                      itemType="answer"
                    />
                  </Col>
                  
                  {/* Answer Content */}
                  <Col>
                    <div 
                      className="mb-2 alist-content" 
                    >
                      {answer.answerText}
                    </div>
                    <div 
                      className="mt-2 d-flex align-items-center gap-2 alist-meta" 
                    >
                      <FaUser className="alist-icon-sm" />
                      <span>Answered by </span>
                      <strong className="alist-author">{answer.author?.name}</strong>
                      {answer.createdAt && (
                        <>
                          <span className="mx-2">•</span>
                          <FaClock className="alist-icon-sm" />
                          <span>{formatDate(answer.createdAt)}</span>
                        </>
                      )}
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))
        ) : (
          <div className="text-center py-4">
            <p className="mb-0 alist-meta">No answers yet. Be the first to answer!</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default AnswerList;