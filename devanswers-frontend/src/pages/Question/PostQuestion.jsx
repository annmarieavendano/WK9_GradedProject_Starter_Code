import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaPaperPlane, FaMagic, FaCheck, FaTimes } from 'react-icons/fa';

import { postQuestion } from '../../reducers/questionSlice.js';
import { improveQuestion } from '../../services/aiService.js';

import { Col, Container, Form, Button, Card, Row, Spinner, Alert } from 'react-bootstrap';
import './PostQuestion.css';

const PostQuestion = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  const [suggestions, setSuggestions] = useState(null); // { title, description, tags }
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.userInfo?.token);

  const handleImprove = async () => {
    setAiError(null);
    setAiLoading(true);
    setSuggestions(null);
    try {
      const result = await improveQuestion({ title, description, tags }, token);
      setSuggestions(result);
    } catch (err) {
      setAiError(err.response?.data?.message || 'Failed to get AI suggestions. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const acceptSuggestion = (field) => {
    if (field === 'title') setTitle(suggestions.title);
    if (field === 'description') setDescription(suggestions.description);
    if (field === 'tags') setTags(suggestions.tags);
    dismissSuggestion(field);
  };

  const dismissSuggestion = (field) => {
    setSuggestions((prev) => {
      if (!prev) return null;
      const next = { ...prev, [field]: null };
      if (!next.title && !next.description && !next.tags) return null;
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await dispatch(postQuestion({ title, description, tags }));
      
      if (postQuestion.fulfilled.match(result)) {
        const newQuestion = result.payload;
        alert('Question posted successfully!');
        navigate(`/question/${newQuestion._id}`);
      }
    } catch (error) {
      console.error('Error posting question:', error);
      alert('Failed to post question. Please try again.');
    }
  };

  return (
    <Container className="py-3 px-2 py-sm-4 px-sm-3 pq-page-container">
      <Row className="justify-content-center">
         <Col xs={12} lg={10} xl={9}>
            <Card className="mb-4 pq-header-card">
              <Card.Body className="p-3 p-sm-4">
                  <Card.Title as="h2" className="pq-title">
                    Ask a Question
                  </Card.Title>
                  <p className="text-muted mb-0">Be specific and imagine you're asking another person</p>
              </Card.Body>
            </Card>

            <Card className="pq-body-card">
              <Card.Body className="p-3 p-sm-4">
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-1">
                    <Form.Label htmlFor="title" className="pq-label">
                      Title
                    </Form.Label>
                    <Form.Control
                      type="text"
                      id="title"
                      name="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="What's your programming question?"
                      required
                      className="pq-input"
                    />
                  </Form.Group>
                  {suggestions?.title && (
                    <div className="pq-suggestion mb-4">
                      <div className="pq-suggestion-label">AI suggestion:</div>
                      <div className="pq-suggestion-text">{suggestions.title}</div>
                      <div className="pq-suggestion-actions">
                        <Button size="sm" variant="success" className="pq-suggestion-btn" onClick={() => acceptSuggestion('title')}>
                          <FaCheck className="me-1" /> Accept
                        </Button>
                        <Button size="sm" variant="outline-secondary" className="pq-suggestion-btn" onClick={() => dismissSuggestion('title')}>
                          <FaTimes className="me-1" /> Reject
                        </Button>
                      </div>
                    </div>
                  )}
                  {!suggestions?.title && <div className="mb-4" />}

                  <Form.Group className="mb-1">
                    <Form.Label htmlFor="description" className="pq-label">
                      Description
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      id="description"
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Provide more details about your question..."
                      rows={10}
                      required
                      className="pq-textarea"
                    />
                  </Form.Group>
                  {suggestions?.description && (
                    <div className="pq-suggestion mb-4">
                      <div className="pq-suggestion-label">AI suggestion:</div>
                      <div className="pq-suggestion-text pq-suggestion-text--pre">{suggestions.description}</div>
                      <div className="pq-suggestion-actions">
                        <Button size="sm" variant="success" className="pq-suggestion-btn" onClick={() => acceptSuggestion('description')}>
                          <FaCheck className="me-1" /> Accept
                        </Button>
                        <Button size="sm" variant="outline-secondary" className="pq-suggestion-btn" onClick={() => dismissSuggestion('description')}>
                          <FaTimes className="me-1" /> Reject
                        </Button>
                      </div>
                    </div>
                  )}
                  {!suggestions?.description && <div className="mb-4" />}

                  <Form.Group className="mb-1">
                    <Form.Label htmlFor="tags" className="pq-label">
                      Tags (comma-separated)
                    </Form.Label>
                    <Form.Control
                      type="text"
                      id="tags"
                      name="tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="e.g., javascript, react, css"
                      className="pq-input"
                    />
                    <Form.Text className="text-muted">
                      Add up to 5 tags to describe what your question is about
                    </Form.Text>
                  </Form.Group>
                  {suggestions?.tags && (
                    <div className="pq-suggestion mb-4">
                      <div className="pq-suggestion-label">AI suggestion:</div>
                      <div className="pq-suggestion-text">{suggestions.tags}</div>
                      <div className="pq-suggestion-actions">
                        <Button size="sm" variant="success" className="pq-suggestion-btn" onClick={() => acceptSuggestion('tags')}>
                          <FaCheck className="me-1" /> Accept
                        </Button>
                        <Button size="sm" variant="outline-secondary" className="pq-suggestion-btn" onClick={() => dismissSuggestion('tags')}>
                          <FaTimes className="me-1" /> Reject
                        </Button>
                      </div>
                    </div>
                  )}
                  {!suggestions?.tags && <div className="mb-4" />}

                  {aiError && (
                    <Alert variant="danger" className="mb-3" onClose={() => setAiError(null)} dismissible>
                      {aiError}
                    </Alert>
                  )}

                  <div className="d-flex gap-3 flex-column flex-sm-row">
                    <Button
                      type="button"
                      variant="outline-primary"
                      size="lg"
                      className="pq-ai-btn"
                      onClick={handleImprove}
                      disabled={aiLoading || (!title && !description)}
                    >
                      {aiLoading ? (
                        <><Spinner size="sm" className="me-2" />Improving...</>
                      ) : (
                        <><FaMagic className="me-2" />Improve with AI</>
                      )}
                    </Button>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-100 pq-btn"
                    >
                      <FaPaperPlane className="me-2" />
                      Post Question
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
    </Container>
  );
};

export default PostQuestion;