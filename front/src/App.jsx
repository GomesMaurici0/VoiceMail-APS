import Inbox from "./components/Inbox";
import { useState } from "react";

function App() {
  const [reload, setReload] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  return (
    <>
      {showIntro ? (
        <section className="intro-work">
          <div className="eco-glow glow-left"></div>
          <div className="eco-glow glow-right"></div>
          <div className="eco-grid"></div>

          <div className="intro-card">
            <div className="intro-top">
              <span className="intro-badge">♻ ECO CONTROL SYSTEM</span>
            </div>

            <h1>
              Gestão Ambiental
              <br />
              & Controle de Registros
            </h1>

            <p>
              Monitoramento inteligente de ocorrências ambientais,
              sustentabilidade, reciclagem e controle de registros por áudio.
            </p>

            <div className="intro-icons">
              <div>🌱 Sustentabilidade</div>
              <div>♻ Reciclagem</div>
              <div>📋 Controle</div>
              <div>🎙 Registros em áudio</div>
            </div>

            <button onClick={() => setShowIntro(false)}>
              Acessar Sistema →
            </button>
          </div>
        </section>
      ) : (
        <Inbox
          reload={reload}
          onRefresh={() => setReload((prev) => !prev)}
        />
      )}
    </>
  );
}

export default App;