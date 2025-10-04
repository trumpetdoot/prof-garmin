async function clipSegment() {
  const response = await fetch("http://localhost:3000/clip", {
    method: "POST",
  });
  const data = await response.json();
  const transcriptElem = document.getElementById("transcript");
  if (transcriptElem) {
    transcriptElem.innerText = data.transcript;
  }
}

export default function App() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Lecture Clipper MVP</h1>
      <video width="640" height="360" controls>
        <source src="/sample-lecture.mp4" type="video/mp4" />
      </video>
      <br />
      <button onClick={clipSegment} style={{ marginTop: "20px" }}>
        Clip Last 30s
      </button>
      <div id="transcript" style={{ marginTop: "20px" }}></div>
    </div>
  );
}
