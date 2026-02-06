import { useEffect, useState } from "react";
import Header from "./components/Header";
import Tabs from "./components/Tabs";
import AlertMessage from "./components/AlertMessage";
import GenerateTab from "./components/GenerateTab";
import HistoryTab from "./components/HistoryTab";
import QuizCard from "./components/QuizCard";
import Modal from "./components/Modal";

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
        <div className="min-h-screen bg-gray-50">
            <Header
                activeTab={activeTab}
                takeMode={takeMode}
                onToggleTakeMode={() => setTakeMode(!takeMode)}
            />
            <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
            <AlertMessage message={error} />

            {activeTab === "generate" ? (
                <GenerateTab
                    url={url}
                    onUrlChange={setUrl}
                    onGenerate={handleGenerate}
                    loading={loading}
                    quiz={quiz}
                    takeMode={takeMode}
                />
            ) : (
                <HistoryTab history={history} onOpenDetails={openDetails} />
            )}

            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <QuizCard quiz={detailQuiz} takeMode={false} />
            </Modal>
        </div>
    );
}
