import QuizCard from "./QuizCard";

export default function GenerateTab({
    url,
    onUrlChange,
    onGenerate,
    loading,
    quiz,
    takeMode
}) {
    return (
        <section className="max-w-6xl mx-auto px-6 md:px-8 py-8">
            {/* Input Row */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <input
                    type="url"
                    placeholder="Enter Wikipedia URL (e.g., https://en.wikipedia.org/wiki/Alan_Turing)"
                    value={url}
                    onChange={(e) => onUrlChange(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
                <button
                    type="button"
                    onClick={onGenerate}
                    disabled={loading || !url}
                    className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-lg transition whitespace-nowrap"
                >
                    {loading ? "Generating..." : "Generate Quiz"}
                </button>
            </div>

            {/* Quiz Display */}
            <QuizCard quiz={quiz} takeMode={takeMode} />
        </section>
    );
}
