const qrcode = require('qrcode');

let currentQrCode = null;

async function generateQRCode(qr) {
    currentQrCode = await qrcode.toDataURL(qr);
    console.log('New QR Code generated:', currentQrCode);
    return currentQrCode;
}

function getCurrentQRCode() {
    return currentQrCode || 'QR code not yet generated. Please wait...';
}

module.exports = { generateQRCode, getCurrentQRCode };