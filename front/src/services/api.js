const urlApi = "https://voicemail-aps.onrender.com/api/voicemails"

export async function listarVoicemails() {
    const res = await fetch(urlApi);
    return res.json();
}

export async function criarVoicemail(data) {
    await fetch(urlApi, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export async function marcarComoOuvido(id) {
    await fetch(`${urlApi}/${id}/ouvido`, {
        method: "PATCH",
    });
}

export async function deletarVoicemail(id) {
    await fetch(`${urlApi}/${id}`, {
        method: "DELETE",
    });
}