const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const express = require('express');
const app = express();
app.use(express.json());

let sock;

(async () => {
    const { state, saveCreds } = await useMultiFileAuthState('auth');
    sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        browser: ['OBLIVION', 'Chrome', '120.0.0.0']
    });

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) console.log('SCAN QR INI:', qr);
        if (connection === 'close') {
            const reason = lastDisconnect?.error?.output?.statusCode;
            if (reason !== DisconnectReason.loggedOut) process.exit(0);
        }
        if (connection === 'open') console.log('✅ OBLIVION READY');
    });
})();

app.get('/', (req, res) => {
    res.send('🔥 OBLIVION SERVER AKTIF');
});

app.post('/api/strike', async (req, res) => {
    const { target, bug } = req.body;
    try {
        const jid = target.includes('@') ? target : target + '@s.whatsapp.net';
        await sock.sendMessage(jid, { text: '🔥 SERANGAN ' + bug.toUpperCase() });
        res.json({ status: 'success', message: 'Bug dikirim ke ' + target });
    } catch (e) {
        res.status(500).json({ status: 'error', message: e.message });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 OBLIVION running on port ${port}`));
