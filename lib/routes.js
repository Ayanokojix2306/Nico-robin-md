const { getCurrentQRCode } = require('./qr');

function setupRoutes(app) {
    // Serve the QR code at /qr endpoint
    app.get('/qr', (req, res) => {
        res.send(getCurrentQRCode());
    });
}

module.exports = { setupRoutes };