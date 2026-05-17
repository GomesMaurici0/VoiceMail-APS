/**
 * EXEMPLO DE COMO INTEGRAR O WEBSOCKET NO COMPONENTE INBOX
 *
 * Este arquivo mostra como usar o hook useVoiceMailWebSocket
 * para sincronização em tempo real no seu componente Inbox.jsx
 *
 * Para usar, substitua o trecho no seu Inbox.jsx:
 */

import { useEffect, useMemo, useState } from "react";
import Recorder from "./Recorder";
import useVoiceMailWebSocket from "../hooks/useVoiceMailWebSocket";
import {
    listarVoicemails,
    marcarComoOuvido,
    deletarVoicemail,
} from "../services/api";

export default function InboxComWebSocket({ reload }) {
    const [aba, setAba] = useState("inbox");
    const [mensagens, setMensagens] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(true);
    const [painelMinimizado, setPainelMinimizado] = useState(false);
    const [tocando, setTocando] = useState(false);
    const [duracao, setDuracao] = useState("0:00");

    // 🔌 Conectar ao WebSocket
    const { isConnected, isLoading: wsLoading } = useVoiceMailWebSocket({
        url: "ws://localhost:8080/ws/voicemails",

        // Quando um novo voicemail chega
        onNewVoiceMail: (novoVoicemail) => {
            console.log("🎤 Novo voicemail recebido via WebSocket:", novoVoicemail);
            setMensagens((prev) => [novoVoicemail, ...prev]);
        },

        // Quando um voicemail é marcado como ouvido
        onVoiceMailUpdated: (update) => {
            console.log("📝 Voicemail atualizado:", update);
            setMensagens((prev) =>
                prev.map((m) =>
                    m.id === update.voiceMailId
                        ? { ...m, ouvido: update.ouvido }
                        : m
                )
            );

            // Atualizar o painel de detalhes se estiver aberto
            if (selected?.id === update.voiceMailId) {
                setSelected((prev) => ({
                    ...prev,
                    ouvido: update.ouvido,
                }));
            }
        },

        // Quando um voicemail é deletado
        onVoiceMailDeleted: (deletion) => {
            console.log("🗑️ Voicemail deletado:", deletion);
            setMensagens((prev) =>
                prev.filter((m) => m.id !== deletion.voiceMailId)
            );

            // Fechar painel de detalhes se estiver aberto
            if (selected?.id === deletion.voiceMailId) {
                setSelected(null);
                setPainelMinimizado(false);
                setTocando(false);
            }
        },
    });

    // Carregar mensagens iniciais
    async function carregar() {
        setLoading(true);
        const data = await listarVoicemails();
        setMensagens(data);
        setSelected(null);
        setPainelMinimizado(false);
        setTocando(false);
        setLoading(false);
    }

    useEffect(() => {
        carregar();
    }, [reload]);

    // ... resto do código do componente permanece igual ...

    // Indicador visual de conexão WebSocket
    const connectionIndicator = (
        <div className="ws-indicator" style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 12px",
            backgroundColor: isConnected ? "#4ade80" : "#ef4444",
            color: "white",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "bold",
        }}>
            <span style={{
                width: "8px",
                height: "8px",
                backgroundColor: "white",
                borderRadius: "50%",
                display: "inline-block",
                animation: isConnected ? "pulse 1s infinite" : "none"
            }}></span>
            {isConnected ? "WebSocket Conectado" : "WebSocket Desconectado"}
        </div>
    );

    // ... retornar JSX com connectionIndicator incluído ...

    return (
        <main className="app-shell">
            {connectionIndicator}
            {/* ... resto do JSX ... */}
        </main>
    );
}

/**
 * ALTERNATIVAMENTE, use este trecho modificado no seu Inbox.jsx atual:
 *
 * 1. Importe o hook no topo do arquivo:
 *    import useVoiceMailWebSocket from "../hooks/useVoiceMailWebSocket";
 *
 * 2. Adicione logo após os estados existentes:
 *    const { isConnected } = useVoiceMailWebSocket({
 *        url: "ws://localhost:8080/ws/voicemails",
 *        onNewVoiceMail: (novo) => setMensagens([novo, ...mensagens]),
 *        onVoiceMailUpdated: (update) => setMensagens(prev =>
 *            prev.map(m => m.id === update.voiceMailId
 *                ? {...m, ouvido: update.ouvido} : m)
 *        ),
 *        onVoiceMailDeleted: (del) => {
 *            setMensagens(prev => prev.filter(m => m.id !== del.voiceMailId));
 *            if (selected?.id === del.voiceMailId) setSelected(null);
 *        }
 *    });
 *
 * 3. Pronto! Agora você tem sincronização em tempo real.
 */

