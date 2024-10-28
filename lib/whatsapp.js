const { default: makeWASocket } = require('@whiskeysockets/baileys');
const { initializeAuth } = require('./auth');
const { setupEvents } = require('./events');

async function connectToWhatsApp() {
    try {
        const { state, saveCreds } = await initializeAuth();
        
        const conn = makeWASocket({
            auth: state,
        });
        
        conn.auth = { saveCreds };

        setupEvents(conn);

        conn.ev.on('connection.update', async (update) => {
            const { connection } = update;

            if (connection === 'open') {
                console.log('Connected to WhatsApp');
                const userId = conn.user.id; // Safe to access now
                console.log('User ID:', userId);
                // Send a message to the user when connected
                await conn.sendMessage(userId, { text: 'Bot is now online! i told you it would work didnt i?' });
            } else if (connection === 'close') {
                console.log('Connection closed. Attempting to reconnect...');
                // Handle reconnection logic here if needed
            }
        });
    } catch (error) {
        // Error handling for connection issues
        console.error('Failed to connect to WhatsApp:', error);
    }
}

module.exports = { connectToWhatsApp };