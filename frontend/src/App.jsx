import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

const emptyQuiz = {
    id: null,
    url: "",
    title: "",
    summary: "",
    key_entities: { people: [], organizations: [], locations: [] },
    sections: [],
    quiz: [],
    related_topics: [],
};

function QuizCard({ quiz, takeMode }) {
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        setAnswers({});
        setSubmitted(false);
    }, [quiz.id, takeMode]);

    const score = useMemo(() => {
        if (!submitted) return 0;
        return quiz.quiz.reduce((total, question, index) => {
            return total + (answers[index] === question.answer ? 1 : 0);
        }, 0);
    }, [answers, quiz.quiz, submitted]);

    return (
        <div className="quiz-card">
            <div className="quiz-header">
                <div>
                    <p className="eyebrow">Quiz Output</p>
                    <h2>{quiz.title || "Article"}</h2>
                    <p className="muted">{quiz.url}</p>
                </div>
                {takeMode && quiz.quiz.length > 0 ? (
                    <div className="score-box">
                        <p className="muted">Score</p>
                        <p className="score">
                            {submitted ? `${score}/${quiz.quiz.length}` : "-"}
                        </p>
                    </div>
                ) : null}
            </div>

            <div className="grid two">
                <div className="panel">
                    <h3>Summary</h3>
                    <p>{quiz.summary || "No summary available yet."}</p>
                </div>
                <div className="panel">
                    <h3>Key Entities</h3>
                    <div className="chips">
                        {[
                            ...quiz.key_entities.people,
                            ...quiz.key_entities.organizations,
                            ...quiz.key_entities.locations,
                        ].map((item) => (
                            <span key={item} className="chip">
                                {item}
                            </span>
                        ))}
                        {quiz.key_entities.people.length === 0 &&
                            quiz.key_entities.organizations.length === 0 &&
                            quiz.key_entities.locations.length === 0 ? (
                            <span className="muted">No entities extracted.</span>
                        ) : null}
                    </div>
                </div>
            </div>

            <div className="panel">
                <h3>Sections</h3>
                <div className="chips">
                    {quiz.sections.map((section) => (
                        <span key={section} className="chip alt">
                            {section}
                        </span>
                    ))}
                    {quiz.sections.length === 0 ? (
                        <span className="muted">No sections extracted.</span>
                    ) : null}
                </div>
            </div>

            <div className="panel">
                <h3>Quiz</h3>
                <div className="quiz-list">
                    {quiz.quiz.length === 0 ? (
                        <p className="muted">No quiz generated yet.</p>
                    ) : (
                        // Group questions by section
                        Object.entries(
                            quiz.quiz.reduce((acc, question, index) => {
                                const section = question.section || "General";
                                if (!acc[section]) acc[section] = [];
                                acc[section].push({ ...question, originalIndex: index });
                                return acc;
                            }, {})
                        ).map(([section, questions]) => (
                            <div key={section} className="section-group">
                                <h4 className="section-title">{section}</h4>
                                {questions.map((question) => (
                                    <div key={`${question.question}-${question.originalIndex}`} className="question">
                                        <div className="question-head">
                                            <div>
                                                <p className="question-text">{question.question}</p>
                                                <p className="muted">Difficulty: {question.difficulty}</p>
                                            </div>
                                            {!takeMode ? (
                                                <span className="answer-tag">Answer: {question.answer}</span>
                                            ) : null}
                                        </div>
                                        <div className="options">
                                            {question.options.map((option) => (
                                                <label key={option} className="option">
                                                    {takeMode ? (
                                                        <input
                                                            type="radio"
                                                            name={`question-${question.originalIndex}`}
                                                            value={option}
                                                            checked={answers[question.originalIndex] === option}
                                                            onChange={() =>
                                                                setAnswers((prev) => ({
                                                                    ...prev,
                                                                    [question.originalIndex]: option,
                                                                }))
                                                            }
                                                        />
                                                    ) : null}
                                                    <span>{option}</span>
                                                    {submitted && takeMode ? (
                                                        <span
                                                            className={`badge ${option === question.answer ? "correct" : "wrong"
                                                                }`}
                                                        >
                                                            {option === question.answer ? "Correct" : "Wrong"}
                                                        </span>
                                                    ) : null}
                                                </label>
                                            ))}
                                        </div>
                                        {!takeMode ? (
                                            <p className="explanation">{question.explanation}</p>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        ))
                    )}
                </div>
                {takeMode && quiz.quiz.length > 0 ? (
                    <button
                        className="primary"
                        type="button"
                        onClick={() => setSubmitted(true)}
                    >
                        Submit Answers
                    </button>
                ) : null}
            </div>

            <div className="panel">
                <h3>Related Topics</h3>
                <div className="chips">
                    {quiz.related_topics.map((topic) => (
                        <span key={topic} className="chip">
                            {topic}
                        </span>
                    ))}
                    {quiz.related_topics.length === 0 ? (
                        <span className="muted">No related topics found.</span>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

function Modal({ open, onClose, children }) {
    if (!open) return null;
    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal" onClick={(event) => event.stopPropagation()}>
                <button className="ghost" type="button" onClick={onClose}>
                    Close
                </button>
                {children}
            </div>
        </div>
    );
}

export default function App() {
    const [activeTab, setActiveTab] = useState("generate");
    const [url, setUrl] = useState("");
    const [quiz, setQuiz] = useState(emptyQuiz);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [detailQuiz, setDetailQuiz] = useState(emptyQuiz);
    const [takeMode, setTakeMode] = useState(false);

    const fetchHistory = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/quizzes`);
            if (!response.ok) throw new Error("Failed to load history.");
            const data = await response.json();
            setHistory(data);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleGenerate = async () => {
        if (!url) return;
        setLoading(true);
        setError("");
        try {
            const response = await fetch(`${API_BASE}/api/quizzes/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });
            if (!response.ok) {
                const detail = await response.json();
                throw new Error(detail.detail || "Generation failed.");
            }
            const data = await response.json();
            setQuiz(data);
            await fetchHistory();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const openDetails = async (quizId) => {
        setError("");
        try {
            const response = await fetch(`${API_BASE}/api/quizzes/${quizId}`);
            if (!response.ok) throw new Error("Failed to load quiz details.");
            const data = await response.json();
            setDetailQuiz(data);
            setModalOpen(true);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="app">
            <header className="hero">
                <div>
                    <p className="eyebrow">DeepKlarity Technologies</p>
                    <h1>AI Wiki Quiz Generator</h1>
                    <p className="subtitle">
                        Generate structured quizzes from Wikipedia articles with one click.
                    </p>
                </div>
                <div className="hero-card">
                    <p className="muted">Active Mode</p>
                    <p className="mode">{activeTab === "generate" ? "Generate" : "History"}</p>
                    <button
                        className="ghost"
                        type="button"
                        onClick={() => setTakeMode((prev) => !prev)}
                    >
                        {takeMode ? "Disable" : "Enable"} Take Quiz Mode
                    </button>
                </div>
            </header>

            <div className="tabs">
                <button
                    className={activeTab === "generate" ? "tab active" : "tab"}
                    type="button"
                    onClick={() => setActiveTab("generate")}
                >
                    Generate Quiz
                </button>
                <button
                    className={activeTab === "history" ? "tab active" : "tab"}
                    type="button"
                    onClick={() => setActiveTab("history")}
                >
                    Past Quizzes
                </button>
            </div>

            {error ? <div className="alert">{error}</div> : null}

            {activeTab === "generate" ? (
                <section className="section">
                    <div className="input-row">
                        <input
                            type="url"
                            placeholder="Paste a Wikipedia URL"
                            value={url}
                            onChange={(event) => setUrl(event.target.value)}
                        />
                        <button
                            className="primary"
                            type="button"
                            onClick={handleGenerate}
                            disabled={loading}
                        >
                            {loading ? "Generating..." : "Generate Quiz"}
                        </button>
                    </div>
                    <QuizCard quiz={quiz} takeMode={takeMode} />
                </section>
            ) : (
                <section className="section">
                    <div className="panel">
                        <h3>History</h3>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>URL</th>
                                    <th>Date</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.title}</td>
                                        <td className="muted">{item.url}</td>
                                        <td>{new Date(item.created_at).toLocaleString()}</td>
                                        <td>
                                            <button
                                                className="ghost"
                                                type="button"
                                                onClick={() => openDetails(item.id)}
                                            >
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {history.length === 0 ? (
                            <p className="muted">No quizzes stored yet.</p>
                        ) : null}
                    </div>
                </section>
            )}

            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <QuizCard quiz={detailQuiz} takeMode={takeMode} />
            </Modal>
        </div>
    );
}
