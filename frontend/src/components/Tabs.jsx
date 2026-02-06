export default function Tabs({ activeTab, onTabChange }) {
    const tabs = ["generate", "history"];
    const labels = { generate: "Generate Quiz", history: "Past Quizzes" };

    return (
        <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
            <div className="max-w-6xl mx-auto px-6 md:px-8 flex">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => onTabChange(tab)}
                        className={`px-6 py-4 font-medium text-sm transition border-b-2 ${activeTab === tab
                                ? "text-orange-600 border-orange-600"
                                : "text-gray-600 border-transparent hover:text-gray-900"
                            }`}
                    >
                        {labels[tab]}
                    </button>
                ))}
            </div>
        </div>
    );
}
