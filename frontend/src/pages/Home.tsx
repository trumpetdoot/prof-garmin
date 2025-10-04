import FileUploader from "../components/FileUploader";

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">
                        Welcome to Prof Garmin
                    </h1>
                    <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                        Upload a lecture video and a textbook PDF, then use Prof Garmin to clip the moments that matter. 
                        Each clip is automatically saved with a transcription and connected to relevant textbook references. 
                        Your personal library grows as you study, letting you quickly revisit important explanations, 
                        review notes, and connect concepts across different materials.
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <FileUploader />
                </div>
            </div>
        </div>
    );
}