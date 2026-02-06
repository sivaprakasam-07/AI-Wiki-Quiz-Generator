export default function Modal({ open, onClose, children }) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-2xl max-w-4xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-900 text-lg font-medium"
                    >
                        ✕ Close
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
