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
            } else if (connection === 'close') {
                console.log('Connection closed. Attempting to reconnect...'); // Return both the connection and user ID


}
        });
    } catch (error) {
        // Error handling for connection issues
        console.error('Failed to connect to WhatsApp:', error);
    }
}
module.exports = { connectToWhatsApp };
