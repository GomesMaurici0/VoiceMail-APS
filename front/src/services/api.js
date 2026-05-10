const getAPIURL = () => {
  // Usa a variável de ambiente VITE_API_URL se disponível
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Fallback para produção
  return "https://voicemail-aps.onrender.com/api/voicemails";
};

const API_URL = getAPIURL();


export async function listarVoicemails() {
    const res = await fetch(API_URL);
    return res.json();
}

export async function criarVoicemail(data) {
    await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export async function marcarComoOuvido(id) {
    await fetch(`${API_URL}/${id}/ouvido`, {
        method: "PATCH",
    });
}

export async function deletarVoicemail(id) {
    await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });
}