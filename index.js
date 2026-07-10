const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const express = require('express');
const QRCode = require('qrcode');
const app = express();
app.use(express.json());

let sock, lastQr = '';

(async () => {
    const { state, saveCreds } = await useMultiFileAuthState('auth');
    sock = makeWASocket({
        auth: state,
        browser: ['OBLIVION', 'Chrome', '120.0.0.0']
    });

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) {
            lastQr = qr;
            console.log('QR siap, buka /qr di browser');
        }
        if (connection === 'close') {
            const reason = lastDisconnect?.error?.output?.statusCode;
            if (reason !== DisconnectReason.loggedOut) process.exit(0);
        }
        if (connection === 'open') console.log('✅ OBLIVION READY');
    });
})();

app.get('/', (req, res) => res.send('🔥 OBLIVION SERVER AKTIF'));

app.get('/qr', async (req, res) => {
    if (!lastQr) return res.send('Belum ada QR, tunggu sebentar...');
    try {
        const img = await QRCode.toDataURL(lastQr);
        res.send(`<img src="${img}" style="width:300px;height:300px;"><p>Scan QR dengan WhatsApp</p>`);
    } catch (e) {
        res.status(500).send('Error QR');
    }
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
