const API_URL = "http://localhost:8080/api/voicemails";

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