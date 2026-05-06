const API_URL = "http://localhost:8080/api/voicemails";

// GET - listar
export async function listarVoicemails() {
    const res = await fetch(API_URL);
    return res.json();
}

// POST - criar
export async function criarVoicemail(data) {
    await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

// PATCH - marcar como ouvido
export async function marcarComoOuvido(id) {
    await fetch(`${API_URL}/${id}/ouvido`, {
        method: "PATCH",
    });
}

// DELETE - deletar
export async function deletarVoicemail(id) {
    await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });
}