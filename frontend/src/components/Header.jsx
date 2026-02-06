export default function Header({ activeTab, takeMode, onToggleTakeMode }) {
    return (
        <header className="bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100 px-6 py-12 md:px-8">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex-1">
                    <p className="text-xs font-bold uppercase text-gray-600 mb-2">
                        DeepKlarity Technologies
                    </p>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-3">
                        AI Wiki Quiz Generator
                    </h1>
                    <p className="text-gray-700 max-w-xl">
                        Generate structured quizzes from Wikipedia articles with one click.
                    </p>
                </div>

                <div className="bg-white bg-opacity-90 rounded-2xl p-4 md:p-6 shadow-lg">
                    <p className="text-xs font-bold uppercase text-gray-600 mb-1">Active Mode</p>
                    <p className="text-2xl font-bold text-orange-600 mb-4">
                        {activeTab === "generate" ? "Generate" : "History"}
                    </p>
                    <button
                        type="button"
                        onClick={onToggleTakeMode}
                        className="text-sm text-gray-700 hover:text-gray-900 font-medium transition"
                    >
                        {takeMode ? "Disable" : "Enable"} Take Quiz Mode
                    </button>
                </div>
            </div>
        </header>
    );
}
