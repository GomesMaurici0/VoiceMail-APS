import { useState, useRef } from "react";

export default function Recorder({ onUpload }) {
    const [recording, setRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [transcricao, setTranscricao] = useState("");

    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const recognitionRef = useRef(null);
    const finalTextRef = useRef("");
    const latestTextRef = useRef("");

    async function startRecording() {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        chunksRef.current = [];
        finalTextRef.current = "";
        latestTextRef.current = "";
        setAudioUrl(null);
        setTranscricao("");

        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.lang = "pt-BR";
            recognition.continuous = true;
            recognition.interimResults = true;

            recognition.onresult = (event) => {
                let textoFinal = "";
                let textoParcial = "";

                for (let i = 0; i < event.results.length; i++) {
                    const texto = event.results[i][0].transcript;

                    if (event.results[i].isFinal) {
                        textoFinal += texto + " ";
                    } else {
                        textoParcial += texto + " ";
                    }
                }

                const textoCompleto = `${textoFinal} ${textoParcial}`.trim();

                finalTextRef.current = textoFinal.trim();
                latestTextRef.current = textoCompleto;
                setTranscricao(textoCompleto);
            };

            recognition.start();
            recognitionRef.current = recognition;
        } else {
            setTranscricao("Seu navegador não suporta transcrição automática.");
        }

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
            chunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = async () => {
            recognitionRef.current?.stop();
            setUploading(true);

            const blob = new Blob(chunksRef.current, { type: "audio/webm" });
            const localUrl = URL.createObjectURL(blob);
            setAudioUrl(localUrl);

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

                await fetch("http://localhost:8080/api/voicemails", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        audioUrl: data.secure_url,
                        transcricao: latestTextRef.current || finalTextRef.current || "",
                    }),
                });

                onUpload?.();
            } catch (error) {
                console.error("Erro no upload:", error);
            } finally {
                setUploading(false);
            }
        };

        mediaRecorder.start();
        setRecording(true);
    }

    function stopRecording() {
        mediaRecorderRef.current?.stop();
        recognitionRef.current?.stop();
        setRecording(false);
    }

    return (
        <div className="recorder-card">
            <strong>Novo correio de voz</strong>
            <span>Grave uma nova mensagem</span>

            {!recording ? (
                <button onClick={startRecording} disabled={uploading}>
                    🎤 Gravar áudio
                </button>
            ) : (
                <button className="danger" onClick={stopRecording}>
                    ⏹ Parar gravação
                </button>
            )}

            {uploading && <p>Salvando áudio...</p>}

            {recording && transcricao && (
                <div className="record-preview">
                    <strong>Transcrição ao vivo</strong>
                    <p>{transcricao}</p>
                </div>
            )}

            {audioUrl && (
                <div className="record-preview">
                    <strong>Último áudio gravado</strong>
                    <audio className="mini-audio" controls src={audioUrl}></audio>
                    <p>{transcricao || "Nenhuma transcrição capturada."}</p>
                </div>
            )}
        </div>
    );
}
