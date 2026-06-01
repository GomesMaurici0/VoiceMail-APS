import { useEffect, useState, useRef } from 'react';

/**
 * Hook customizado para gerenciar conexão WebSocket com o servidor
 * @param {string} url - URL do WebSocket (ex: ws://localhost:8080/ws/voicemails)
 * @param {function} onNewVoiceMail - Callback para novo voicemail
 * @param {function} onVoiceMailUpdated - Callback para voicemail atualizado
 * @param {function} onVoiceMailDeleted - Callback para voicemail deletado
 * @returns {object} estado e funções da conexão WebSocket
 */
export const useVoiceMailWebSocket = ({
    url = 'ws://localhost:8080/ws/voicemails',
    onNewVoiceMail,
    onVoiceMailUpdated,
    onVoiceMailDeleted,
} = {}) => {
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const wsRef = useRef(null);

    useEffect(() => {
        const ws = new WebSocket(url);

        ws.onopen = () => {
            console.log('✅ Conectado ao servidor WebSocket');
            setIsConnected(true);
            setIsLoading(false);
        };

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                console.log('📨 Mensagem recebida:', message);

                switch (message.type) {
                    case 'CONNECTED':
                        console.log('✓', message.message);
                        break;

                    case 'NEW_VOICEMAIL':
                        console.log('🎤 Novo voicemail chegou');
                        onNewVoiceMail?.(message.data);
                        break;

                    case 'VOICEMAIL_UPDATED':
                        console.log('📝 Voicemail atualizado:', message.data);
                        onVoiceMailUpdated?.(message.data);
                        break;

                    case 'VOICEMAIL_DELETED':
                        console.log('🗑️ Voicemail deletado:', message.data);
                        onVoiceMailDeleted?.(message.data);
                        break;

                    default:
                        console.warn('Tipo de mensagem desconhecido:', message.type);
                }
            } catch (error) {
                console.error('Erro ao processar mensagem WebSocket:', error);
            }
        };

        ws.onerror = (error) => {
            console.error('❌ Erro WebSocket:', error);
            setIsConnected(false);
        };

        ws.onclose = () => {
            console.log('🔌 Desconectado do servidor');
            setIsConnected(false);
            setIsLoading(false);

            // Tentar reconectar após 3 segundos
            setTimeout(() => {
                console.log('🔄 Tentando reconectar...');
            }, 3000);
        };

        wsRef.current = ws;

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, [url, onNewVoiceMail, onVoiceMailUpdated, onVoiceMailDeleted]);

    return {
        isConnected,
        isLoading,
        send: (message) => {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify(message));
            } else {
                console.warn('WebSocket não está conectado');
            }
        },
    };
};

export default useVoiceMailWebSocket;

