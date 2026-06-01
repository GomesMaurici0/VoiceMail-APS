export const API_URL = "https://voicemail-aps.onrender.com/api/voicemails";
const LOCAL_KEY = "eco_voice_registros";

export function listarLocais() {
  const dados = localStorage.getItem(LOCAL_KEY);
  return dados ? JSON.parse(dados) : [];
}

export function salvarLocais(registros) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(registros));
}

export function adicionarLocal(registro) {
  const registros = listarLocais();
  const novoRegistro = {
    ...registro,
    id: registro.id || crypto.randomUUID(),
    ouvido: registro.ouvido === true ? true : false,
  };

  salvarLocais([novoRegistro, ...registros]);
  return novoRegistro;
}

export function atualizarLocal(id, dados) {
  const registros = listarLocais();

  const atualizados = registros.map((registro) =>
    registro.id === id ? { ...registro, ...dados } : registro
  );

  salvarLocais(atualizados);
}

export function deletarLocal(id) {
  const registros = listarLocais();
  salvarLocais(registros.filter((registro) => registro.id !== id));
}

export async function listarVoicemails() {
  try {
    const res = await fetch(API_URL);

    if (!res.ok) {
      return listarLocais();
    }

    const data = await res.json();
    const listaBackend = Array.isArray(data) ? data : [];
    const listaLocal = listarLocais();

    return [...listaLocal, ...listaBackend];
  } catch {
    return listarLocais();
  }
}

export async function criarVoicemail(data) {
  const registroLocal = adicionarLocal({
    audioUrl: data.audioUrl,
    transcricao: data.transcricao || "",
    ouvido: false,
  });

  try {
    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registroLocal),
    });
  } catch {
    console.warn("Backend indisponível. Registro salvo localmente.");
  }

  return registroLocal;
}

export async function marcarComoOuvido(id) {
  atualizarLocal(id, { ouvido: true });

  try {
    await fetch(`${API_URL}/${id}/ouvido`, {
      method: "PATCH",
    });
  } catch {
    console.warn("Não foi possível atualizar no backend.");
  }
}

export async function deletarVoicemail(id) {
  deletarLocal(id);

  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
  } catch {
    console.warn("Não foi possível deletar no backend.");
  }
}