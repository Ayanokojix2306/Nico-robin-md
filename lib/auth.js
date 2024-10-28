const { useMultiFileAuthState } = require('@whiskeysockets/baileys');

async function initializeAuth() {
    return await useMultiFileAuthState('./auth_info_baileys');
}

module.exports = { initializeAuth };