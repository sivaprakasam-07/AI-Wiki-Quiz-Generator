import { useEffect, useMemo, useState } from "react";
import QuestionItem from "./QuestionItem";

export default function QuizCard({ quiz, takeMode }) {
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

    const groupedQuestions = useMemo(() => {
        return quiz.quiz.reduce((acc, question, index) => {
            const section = question.section || "General";
            if (!acc[section]) acc[section] = [];
            acc[section].push({ ...question, originalIndex: index });
            return acc;
        }, {});
    }, [quiz.quiz]);

    if (!quiz.title) {
        return (
            <section className="max-w-6xl mx-auto px-6 md:px-8 py-8">
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <p className="text-gray-500">Enter a Wikipedia URL and click Generate to see the quiz here.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="max-w-6xl mx-auto px-6 md:px-8 py-8 space-y-6">
            {/* Quiz Header */}
            <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    <div>
                        <p className="text-xs font-bold uppercase text-gray-600 mb-2">Quiz Output</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{quiz.title}</h2>
                        <p className="text-gray-600 break-all text-sm">{quiz.url}</p>
                    </div>
                    {takeMode && quiz.quiz.length > 0 && (
                        <div className="bg-orange-100 rounded-lg p-4 text-center min-w-32">
                            <p className="text-xs font-bold uppercase text-gray-600 mb-1">Score</p>
                            <p className="text-3xl font-bold text-orange-600">
                                {submitted ? `${score}/${quiz.quiz.length}` : "-"}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Summary & Entities */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Summary</h3>
                    <p className="text-gray-700 leading-relaxed">
                        {quiz.summary || "No summary available."}
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Key Entities</h3>
                    <div className="flex flex-wrap gap-2">
                        {[
                            ...quiz.key_entities.people,
                            ...quiz.key_entities.organizations,
                            ...quiz.key_entities.locations,
                        ].map((item) => (
                            <span
                                key={item}
                                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm border border-gray-200"
                            >
                                {item}
                            </span>
                        ))}
                        {[
                            ...quiz.key_entities.people,
                            ...quiz.key_entities.organizations,
                            ...quiz.key_entities.locations,
                        ].length === 0 && (
                                <p className="text-gray-500 text-sm">No entities extracted.</p>
                            )}
                    </div>
                </div>
            </div>

            {/* Sections */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Article Sections</h3>
                <div className="flex flex-wrap gap-2">
                    {quiz.sections.map((section) => (
                        <span
                            key={section}
                            className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm border border-purple-200"
                        >
                            {section}
                        </span>
                    ))}
                    {quiz.sections.length === 0 && (
                        <p className="text-gray-500 text-sm">No sections extracted.</p>
                    )}
                </div>
            </div>

            {/* Quiz Questions */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Quiz</h3>

                {quiz.quiz.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No quiz generated yet.</p>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(groupedQuestions).map(([section, questions]) => (
                            <div key={section} className="border-l-4 border-orange-600 pl-4">
                                <h4 className="text-lg font-bold text-orange-600 mb-4 pb-2 border-b border-orange-200">
                                    {section}
                                </h4>
                                <div className="space-y-4">
                                    {questions.map((question) => (
                                        <QuestionItem
                                            key={`${question.question}-${question.originalIndex}`}
                                            question={question}
                                            index={question.originalIndex}
                                            takeMode={takeMode}
                                            answer={answers[question.originalIndex]}
                                            submitted={submitted}
                                            onAnswerChange={(idx, opt) =>
                                                setAnswers((prev) => ({ ...prev, [idx]: opt }))
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {takeMode && quiz.quiz.length > 0 && (
                    <button
                        type="button"
                        onClick={() => setSubmitted(true)}
                        className="mt-8 w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition"
                    >
                        Submit Answers
                    </button>
                )}
            </div>

            {/* Related Topics */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Related Topics</h3>
                <div className="flex flex-wrap gap-2">
                    {quiz.related_topics.map((topic) => (
                        <span
                            key={topic}
                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-200"
                        >
                            {topic}
                        </span>
                    ))}
                    {quiz.related_topics.length === 0 && (
                        <p className="text-gray-500 text-sm">No related topics found.</p>
                    )}
                </div>
            </div>
        </section>
    );
}
