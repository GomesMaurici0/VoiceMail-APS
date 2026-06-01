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

  function normalizarMensagem(m) {
    return {
      ...m,
      id: m.id || m._id || crypto.randomUUID(),
      ouvido: m.ouvido === true,
    };
  }

  async function carregar() {
    setLoading(true);

    try {
      const data = await listarVoicemails();
      const lista = Array.isArray(data) ? data.map(normalizarMensagem) : [];
      setMensagens(lista);
      setSelected(null);
      setPainelMinimizado(false);
      setTocando(false);
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, [reload]);

  function adicionarNovoRegistro(novoRegistro) {
    const registroNormalizado = normalizarMensagem({
      ...novoRegistro,
      ouvido: false,
    });

    setMensagens((prev) => [registroNormalizado, ...prev]);
    setAba("nao-ouvidos");
    setSelected(registroNormalizado);
    setPainelMinimizado(false);
  }

  async function handleOuvido(id) {
    await marcarComoOuvido(id);

    setMensagens((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, ouvido: true } : msg))
    );

    setSelected((prev) => (prev?.id === id ? { ...prev, ouvido: true } : prev));
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
    aba === "nao-ouvidos" ? mensagens.filter((m) => !m.ouvido) : mensagens;

  if (loading) {
    return <div className="loading">Carregando sistema ambiental...</div>;
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon eco-logo">♻</div>

          <div>
            <strong>EcoVoice</strong>
            <span>Registros ambientais</span>
          </div>
        </div>

        <nav>
          <p>Controle</p>

          <button
            className={aba === "inbox" ? "active" : ""}
            onClick={() => {
              setAba("inbox");
              setSelected(null);
              setPainelMinimizado(false);
            }}
          >
            🌱 Registros <span>{mensagens.length}</span>
          </button>

          <button
            className={aba === "nao-ouvidos" ? "active" : ""}
            onClick={() => {
              setAba("nao-ouvidos");
              setSelected(null);
              setPainelMinimizado(false);
            }}
          >
            ⚠ Pendentes <span>{naoOuvidos}</span>
          </button>
        </nav>

        <Recorder onUpload={adicionarNovoRegistro} />
      </aside>

      <section className="inbox-panel">
        <header className="topbar">
          <span>Gestão de resíduos e comunicação ambiental</span>
          <h1>{aba === "inbox" ? "Registros ambientais" : "Pendentes"}</h1>
        </header>

        <div className="stats">
          <div>
            <span>Total</span>
            <strong>{mensagens.length}</strong>
            <small>registros</small>
          </div>

          <div>
            <span>Pendentes</span>
            <strong>{naoOuvidos}</strong>
            <small>não analisados</small>
          </div>
        </div>

        <div className="section-title">
          <span>Mensagens gravadas</span>
        </div>

        <div className="message-list">
          {mensagensFiltradas.length === 0 && (
            <p className="empty-message">Nenhum registro encontrado.</p>
          )}

          {mensagensFiltradas.map((m, index) => (
            <button
              key={m.id}
              className={`message-card ${
                selected?.id === m.id ? "selected" : ""
              }`}
              onClick={() => selecionarMensagem(m)}
            >
              <div className="avatar">🌿</div>

              <div className="message-info">
                <strong>Ocorrência ambiental #{index + 1}</strong>
                <span>{m.ouvido ? "Analisado" : "Pendente de análise"}</span>
                <p>{m.transcricao || "Registro sem descrição disponível."}</p>

                <div className="meta">
                  <em>{m.ouvido ? "Verificado" : "Aguardando"}</em>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {selected && !painelMinimizado && (
        <section className="details-panel">
          <header className="contact-header">
            <div className="avatar large">♻</div>

            <div>
              <h2>Detalhes do registro</h2>
              <p>{selected.ouvido ? "Registro analisado" : "Registro pendente"}</p>
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
            <button onClick={() => handleDelete(selected.id)}>
              🗑 Apagar registro
            </button>
          </div>

          <div className="audio-box">
            <span>Áudio da ocorrência</span>

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
            <span>Descrição ambiental</span>
            <p>
              {selected.transcricao ||
                "Descrição/transcrição ainda não disponível para este registro."}
            </p>
          </div>
        </section>
      )}

      {selected && painelMinimizado && (
        <button
          className="details-mini-tab"
          onClick={() => setPainelMinimizado(false)}
        >
          Abrir detalhes do registro
        </button>
      )}
    </main>
  );
}