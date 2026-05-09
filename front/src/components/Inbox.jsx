import { useEffect, useMemo, useState } from "react";
import Recorder from "./Recorder";
import {
    listarVoicemails,
    marcarComoOuvido,
    deletarVoicemail,
} from "../services/api";

export default function Inbox({ reload }) {
    const [aba, setAba] = useState("inbox");
    const [mensagens, setMensagens] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(true);
    const [painelMinimizado, setPainelMinimizado] = useState(false);
    const [tocando, setTocando] = useState(false);
    const [duracao, setDuracao] = useState("0:00");

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

    async function handleOuvido(id) {
        await marcarComoOuvido(id);

        setMensagens((prev) =>
            prev.map((msg) => (msg.id === id ? { ...msg, ouvido: true } : msg))
        );

        setSelected((prev) =>
            prev?.id === id ? { ...prev, ouvido: true } : prev
        );
    }

    async function handleDelete(id) {
        await deletarVoicemail(id);
        setMensagens((prev) => prev.filter((msg) => msg.id !== id));

        if (selected?.id === id) {
            setSelected(null);
            setPainelMinimizado(false);
            setTocando(false);
        }
    }

    async function handlePlay() {
        setTocando(true);

        if (selected && !selected.ouvido) {
            await handleOuvido(selected.id);
        }
    }

    function selecionarMensagem(m) {
        setSelected(m);
        setPainelMinimizado(false);
        setTocando(false);
        setDuracao("0:00");
    }

    const naoOuvidos = useMemo(
        () => mensagens.filter((m) => !m.ouvido).length,
        [mensagens]
    );

    const mensagensFiltradas =
        aba === "nao-ouvidos"
            ? mensagens.filter((m) => !m.ouvido)
            : mensagens;

    if (loading) {
        return <div className="loading">Carregando...</div>;
    }

    return (
        <main className="app-shell">
            <aside className="sidebar">
                <div className="brand">
                    <img
                        src="/voicemail-icon.svg"
                        alt="Correio de Voz"
                        className="brand-icon"
                    />

                    <div>
                        <strong>Correio de Voz</strong>
                        <span>Mensagens gravadas</span>
                    </div>
                </div>

                <nav>
                    <p>Caixas</p>

                    <button
                        className={aba === "inbox" ? "active" : ""}
                        onClick={() => {
                            setAba("inbox");
                            setSelected(null);
                            setPainelMinimizado(false);
                        }}
                    >
                        ▣ Inbox <span>{mensagens.length}</span>
                    </button>

                    <button
                        className={aba === "nao-ouvidos" ? "active" : ""}
                        onClick={() => {
                            setAba("nao-ouvidos");
                            setSelected(null);
                            setPainelMinimizado(false);
                        }}
                    >
                        □ Não ouvidos <span>{naoOuvidos}</span>
                    </button>
                </nav>

                <Recorder onUpload={carregar} />
            </aside>

            <section className="inbox-panel">
                <header className="topbar">
                    <h1>{aba === "inbox" ? "Inbox" : "Não ouvidos"}</h1>
                </header>

                <div className="stats">
                    <div>
                        <span>Total</span>
                        <strong>{mensagens.length}</strong>
                        <small>mensagens</small>
                    </div>

                    <div>
                        <span>Não ouvidos</span>
                        <strong>{naoOuvidos}</strong>
                        <small>pendentes</small>
                    </div>
                </div>

                <div className="section-title">
                    <span>Mensagens</span>
                </div>

                <div className="message-list">
                    {mensagensFiltradas.length === 0 && (
                        <p>Nenhuma mensagem nesta caixa.</p>
                    )}

                    {mensagensFiltradas.map((m, index) => (
                        <button
                            key={m.id}
                            className={`message-card ${selected?.id === m.id ? "selected" : ""}`}
                            onClick={() => selecionarMensagem(m)}
                        >
                            <div className="avatar">VM</div>

                            <div className="message-info">
                                <strong>Correio de voz #{index + 1}</strong>
                                <span>{m.ouvido ? "Ouvido" : "Não ouvido"}</span>
                                <p>{m.transcricao || "Mensagem sem transcrição."}</p>

                                <div className="meta">
                                    <em>{m.ouvido ? "Ouvida" : "Pendente"}</em>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {selected && !painelMinimizado && (
                <section className="details-panel">
                    <header className="contact-header">
                        <div className="avatar large">VM</div>

                        <div>
                            <h2>Visualização do áudio</h2>
                            <p>{selected.ouvido ? "Mensagem ouvida" : "Mensagem não ouvida"}</p>
                        </div>

                        <button
                            className="minimize-details"
                            onClick={() => setPainelMinimizado(true)}
                            title="Minimizar visualização"
                        >
                            −
                        </button>
                    </header>

                    <div className="actions">
                        <button onClick={() => handleDelete(selected.id)}>🗑 Apagar</button>
                    </div>

                    <div className="audio-box">
                        <span>Intonações vocais</span>

                        <div className={`waveform ${tocando ? "playing" : ""}`}>
                            {Array.from({ length: 44 }).map((_, i) => (
                                <i
                                    key={i}
                                    style={{
                                        height: `${16 + (i % 7) * 8}px`,
                                        animationDelay: `${i * 0.04}s`,
                                    }}
                                />
                            ))}
                        </div>

                        <div className="audio-time">
                            Duração: <strong>{duracao}</strong>
                        </div>

                        <audio
                            className="audio-player"
                            controls
                            src={selected.audioUrl}
                            onLoadedMetadata={(e) => {
                                const total = Math.floor(e.currentTarget.duration || 0);
                                const min = Math.floor(total / 60);
                                const sec = String(total % 60).padStart(2, "0");
                                setDuracao(`${min}:${sec}`);
                            }}
                            onPlay={handlePlay}
                            onPause={() => setTocando(false)}
                            onEnded={() => setTocando(false)}
                        ></audio>
                    </div>

                    <div className="transcription">
                        <span>Descrição</span>
                        <p>
                            {selected.transcricao ||
                                "Descrição/transcrição ainda não disponível para este áudio."}
                        </p>
                    </div>
                </section>
            )}

            {selected && painelMinimizado && (
                <button
                    className="details-mini-tab"
                    onClick={() => setPainelMinimizado(false)}
                >
                    Abrir visualização do áudio
                </button>
            )}
        </main>
    );
}
