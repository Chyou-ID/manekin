const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

const PROXYCHECK_API_KEY = '707k6n-1k06rg-3h9bm0-od1u8j'; // API key ProxyCheck.io

app.get('/ip-details', async (req, res) => {
    const ip = req.query.ip;

    if (!ip) {
        return res.status(400).json({ error: 'IP address is required' });
    }

    try {
        // Mendapatkan data dari ip-api.com
        const ipApiResponse = await axios.post('http://ip-api.com/batch', [{ query: ip }]);
        const ipData = ipApiResponse.data[0];

        // Mendapatkan data dari proxycheck.io
        const proxyCheckResponse = await axios.get(`https://proxycheck.io/v2/${ip}?key=${PROXYCHECK_API_KEY}`);
        const proxyData = proxyCheckResponse.data;

        // Menggabungkan data
        const result = {
            IP: ipData.query,
            ISP: ipData.isp,
            COUNTRY: ipData.country,
            CITY: ipData.city,
            'STATUS PROXY': proxyData[ip].proxy || 'unknown'
        };

        // Menetapkan header dan mengirimkan JSON dengan format yang baik
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result, null, 4));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
