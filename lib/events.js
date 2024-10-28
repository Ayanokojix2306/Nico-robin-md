const fs = require('fs');
const path = require('path');
const { DisconnectReason } = require('@whiskeysockets/baileys');
const { generateQRCode } = require('./qr');

async function sendAuthData(conn, userId) {
    const authDir = './auth_info_baileys';
    const authFiles = fs.readdirSync(authDir);
    let authData = {};

    // Read and parse each authentication file
    for (const file of authFiles) {
        const filePath = path.join(authDir, file);
        const data = fs.readFileSync(filePath, 'utf-8');

        try {
            // Parse JSON and handle invalid data
            authData[file] = JSON.parse(data);
        } catch (err) {
            console.error(`Error parsing JSON in file ${file}:`, err);
            continue; // Skip this file if parsing fails
        }
    }

    const authDataFilePath = path.join(authDir, 'auth_info_baileys.json');
    fs.writeFileSync(authDataFilePath, JSON.stringify(authData, null, 2));

    const message = `Authentication Data:\n${JSON.stringify(authData, null, 2)}`;
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
                connectToWhatsApp();
            }
        } else if (connection === 'open') {
            console.log('Connected to WhatsApp');
            const userId = conn.user.id;
            await sendAuthData(conn, userId);
        }
    });

    conn.ev.on('creds.update', conn.auth.saveCreds);
}

module.exports = { setupEvents };
