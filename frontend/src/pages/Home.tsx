import FileUploader from "../components/FileUploader";

const Home = () => {
    return (
        <div>
        <div className="intro-header">
            <h1>Welcome to Prof Garmin</h1>
            <p>Upload a lecture video and a textbook PDF, 
            then use Prof Garmin to clip the moments that matter. 
            Each clip is automatically saved with a transcription 
            and connected to relevant textbook references. 
            Your personal library grows as you study, letting 
            you quickly revisit important explanations, review notes, 
            and connect concepts across different materials.
            </p>
        </div>
        <div>
            <FileUploader/>
        </div>
        </div>
    )
};

export default Home;