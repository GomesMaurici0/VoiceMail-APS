import { useEffect, useState } from "react";
import {
    listarVoicemails,
    marcarComoOuvido,
    deletarVoicemail,
} from "../services/api";

export default function Inbox({ reload }) {
    const [mensagens, setMensagens] = useState([]);
    const [loading, setLoading] = useState(true);

    async function carregar() {
        setLoading(true);
        const data = await listarVoicemails();
        setMensagens(data);
        setLoading(false);
    }

    useEffect(() => {
        carregar();
    }, [reload]); // 🔥 agora reage a mudanças

    async function handleOuvido(id) {
        await marcarComoOuvido(id);
        carregar();
    }

    async function handleDelete(id) {
        await deletarVoicemail(id);
        carregar();
    }

    if (loading) return <p>Carregando...</p>;

    return (
        <div>
            <h2>📥 Inbox</h2>

            {mensagens.length === 0 && <p>Nenhuma mensagem ainda</p>}

            {mensagens.map((m) => (
                <div
                    key={m.id}
                    style={{
                        border: "1px solid #ccc",
                        margin: 10,
                        padding: 10,
                        background: m.ouvido ? "#f5f5f5" : "#e6f7ff",
                    }}
                >
                    <p><strong>ID:</strong> {m.id}</p>

                    <audio controls src={m.audioUrl}></audio>

                    <p>Status: {m.ouvido ? "Ouvido" : "Não ouvido"}</p>

                    {!m.ouvido && (
                        <button onClick={() => handleOuvido(m.id)}>
                            Marcar como ouvido
                        </button>
                    )}

                    <button onClick={() => handleDelete(m.id)}>
                        Deletar
                    </button>
                </div>
            ))}
        </div>
    );
}