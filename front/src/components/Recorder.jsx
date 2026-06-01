import { useRef, useState } from "react";
import { criarVoicemail } from "../services/api";

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
    try {
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

          const novoRegistro = await criarVoicemail({
            audioUrl: data.secure_url,
            transcricao: latestTextRef.current || finalTextRef.current || "",
            ouvido: false,
          });

          onUpload?.(novoRegistro);
        } catch (error) {
          console.error("Erro ao salvar áudio:", error);
          alert("Não foi possível salvar o áudio.");
        } finally {
          setUploading(false);
        }
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Erro ao acessar microfone:", error);
      alert("Não foi possível acessar o microfone.");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    recognitionRef.current?.stop();
    setRecording(false);
  }

  return (
    <div className="recorder-card">
      <strong>Novo registro ambiental</strong>
      <span>Grave uma ocorrência, aviso ou observação</span>

      {!recording ? (
        <button onClick={startRecording} disabled={uploading}>
          🎤 Gravar registro
        </button>
      ) : (
        <button className="danger" onClick={stopRecording}>
          ⏹ Parar gravação
        </button>
      )}

      {uploading && <p>Salvando registro...</p>}

      {audioUrl && (
        <div className="record-preview">
          <strong>Último registro gravado</strong>
          <audio className="mini-audio" controls src={audioUrl}></audio>
          <p>{transcricao || "Nenhuma transcrição capturada."}</p>
        </div>
      )}
    </div>
  );
}