require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public')); // Melayani file statis dari folder public

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {
        // Inisialisasi model dengan instruksi sistem untuk SearchBook
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "Anda adalah Pustakawan SearchBook. Bantu siswa mencari buku berdasarkan minat mereka. Berikan judul, penulis, dan alasan singkat kenapa buku itu bagus."
        });

        const result = await model.generateContent(userMessage);
        const response = await result.response;
        res.json({ reply: response.text() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Terjadi kesalahan pada server." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SearchBook berjalan di http://localhost:${PORT}`));