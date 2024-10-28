const { default: makeWASocket } = require('@whiskeysockets/baileys');
const { initializeAuth } = require('./auth');
const { setupEvents } = require('./events');

async function connectToWhatsApp() {
    const { state, saveCreds } = await initializeAuth();

    const conn = makeWASocket({
        auth: state,
    });

    conn.auth = { saveCreds };
    await setupEvents(conn);

    // Get the logged-in user's number
    const userId = conn.user.id; // This contains the logged-in user's number
    console.log(`Logged in as: ${userId}`);
    
    return { conn, userId }; // Return both the connection and user ID
}

module.exports = { connectToWhatsApp };