import { useState, useRef } from "react";

export default function Recorder(props) {
    const [recording, setRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);

    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    async function startRecording() {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
            chunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = async () => {
            const blob = new Blob(chunksRef.current, { type: "audio/webm" });

            const formData = new FormData();
            formData.append("file", blob);
            formData.append("upload_preset", "voicemail_upload");

            try {
                const response = await fetch(
                    "https://api.cloudinary.com/v1_1/dhyra35kt/auto/upload",
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                const data = await response.json();
                const url = data.secure_url;

                // 🔥 salva no backend
                await fetch("http://localhost:8080/api/voicemails", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        audioUrl: url,
                    }),
                });

                console.log("URL Cloudinary:", url);

                setAudioUrl(url);

                // ✅ AQUI
                props.onUpload && props.onUpload();

            } catch (error) {
                console.error("Erro no upload:", error);
            }

            chunksRef.current = [];
        };

        mediaRecorder.start();
        setRecording(true);
    }

    function stopRecording() {
        mediaRecorderRef.current.stop();
        setRecording(false);
    }

    return (
        <div>
            <h2>Gravador</h2>

            {!recording ? (
                <button onClick={startRecording}>🎤 Gravar</button>
            ) : (
                <button onClick={stopRecording}>⏹ Parar</button>
            )}

            {audioUrl && (
                <div>
                    <h3>Prévia:</h3>
                    <audio controls src={audioUrl}></audio>
                </div>
            )}
        </div>
    );
}