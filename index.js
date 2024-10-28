const express = require('express');
const path = require('path'); // Import path to resolve file paths
const { connectToWhatsApp } = require('./lib/whatsapp');
const { setupRoutes } = require('./lib/routes');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Setup routes
setupRoutes(app);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    connectToWhatsApp(); // Start the WhatsApp connection when the server starts
});