const fs = require('fs');
const path = require('path');
const { DisconnectReason } = require('@whiskeysockets/baileys');
const { generateQRCode } = require('./qr');
const { connectToWhatsApp } = require('./whatsapp'); // Importing connectToWhatsApp

async function sendAuthData(conn, userId) {
    const authDir = './auth_info_baileys';
    const authFiles = fs.readdirSync(authDir);
    let authData = {};

    // Read each authentication file and combine data
    for (const file of authFiles) {
        const data = fs.readFileSync(path.join(authDir, file), 'utf-8');
        authData[file] = JSON.parse(data);
    }

    // Save the auth data to a JSON file
    const authDataFilePath = path.join(authDir, 'auth_info_baileys.json');
    fs.writeFileSync(authDataFilePath, JSON.stringify(authData, null, 2));

    // Format the auth data as a message
    const message = `Authentication Data:\n${JSON.stringify(authData, null, 2)}`;

    // Send the message to the logged-in user
    await conn.sendMessage(userId, { text: message });
}

async function setupEvents(conn) {
    conn.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            await generateQRCode(qr);
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Connection closed. Reconnecting:', shouldReconnect);
            if (shouldReconnect) {
                connectToWhatsApp(); // Reconnect if not logged out
            }
        } else if (connection === 'open') {
            console.log('Connected to WhatsApp');
            const userId = conn.user.id; // Get the logged-in user's ID
            await sendAuthData(conn, userId); // Send auth data to the logged-in user
        }
    });

    conn.ev.on('creds.update', conn.auth.saveCreds); // Save authentication state
}

module.exports = { setupEvents };