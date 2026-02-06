export default function AlertMessage({ message }) {
    if (!message) return null;
    return (
        <div className="max-w-6xl mx-auto mx-4 md:mx-8 my-4">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {message}
            </div>
        </div>
    );
}
