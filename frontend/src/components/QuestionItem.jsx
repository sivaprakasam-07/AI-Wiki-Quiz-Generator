export default function QuestionItem({
    question,
    index,
    takeMode,
    answer,
    submitted,
    onAnswerChange
}) {
    const difficultyColors = {
        easy: "bg-green-100 text-green-700",
        medium: "bg-yellow-100 text-yellow-700",
        hard: "bg-red-100 text-red-700"
    };

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2">{question.question}</h4>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[question.difficulty] || difficultyColors.medium}`}>
                        {question.difficulty}
                    </span>
                </div>
                {!takeMode && (
                    <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded text-sm font-medium whitespace-nowrap">
                        Answer: {question.answer}
                    </div>
                )}
            </div>

            <div className="space-y-2 mb-4">
                {question.options.map((option) => (
                    <label key={option} className="flex items-start gap-3 p-3 rounded bg-white border border-gray-200 hover:border-orange-400 cursor-pointer transition">
                        {takeMode && (
                            <input
                                type="radio"
                                name={`question-${index}`}
                                value={option}
                                checked={answer === option}
                                onChange={() => onAnswerChange(index, option)}
                                className="mt-1 accent-orange-600"
                            />
                        )}
                        <span className="flex-1 text-gray-900">{option}</span>
                        {submitted && takeMode && (
                            <span className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap ${option === question.answer
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}>
                                {option === question.answer ? "✓ Correct" : "✗ Wrong"}
                            </span>
                        )}
                    </label>
                ))}
            </div>

            {!takeMode && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-gray-700">
                    <p className="font-medium text-blue-900 mb-1">Explanation:</p>
                    <p>{question.explanation}</p>
                </div>
            )}
        </div>
    );
}
