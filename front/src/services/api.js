const getAPIURL = () => {
  const isDevelopment = import.meta.env.MODE === 'development';

  if (isDevelopment) {
    const host = window.location.hostname;
    const port = 8080;
    return `http://${host}:${port}/api/voicemails`;
  }

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