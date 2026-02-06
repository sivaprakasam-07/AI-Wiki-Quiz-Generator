export default function HistoryTab({ history, onOpenDetails }) {
    return (
        <section className="max-w-6xl mx-auto px-6 md:px-8 py-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-700">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-700">URL</th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-700">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-700"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {history.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                        No quizzes generated yet.
                                    </td>
                                </tr>
                            ) : (
                                history.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-900">{item.title}</td>
                                        <td className="px-6 py-4 text-gray-600 text-sm truncate max-w-xs">{item.url}</td>
                                        <td className="px-6 py-4 text-gray-600 text-sm">
                                            {new Date(item.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() => onOpenDetails(item.id)}
                                                className="text-orange-600 hover:text-orange-700 font-medium transition"
                                            >
                                                Details →
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
