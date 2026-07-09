const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('🔥 OBLIVION SERVER AKTIF');
});

app.post('/api/strike', (req, res) => {
    const { target, bug } = req.body;
    res.json({
        status: 'success',
        target: target,
        bug: bug,
        message: '🔥 Serangan dikirim ke ' + target
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`🚀 OBLIVION running on port ${port}`);
});
