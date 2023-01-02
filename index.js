const express = require('express');
const axios = require("axios");
const port = 3000;

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Connected to ${port}`);
})

app.post('/compare', async (req, res) => {
    let statusCount = {
        200: 0,
        304: 0,
        400: 0,
        404: 0,
        408: 0,
        420: 0,
        500: 0,
        502: 0,
        503: 0,
        504: 0
    }
    let totalTime = 0;
    let count = 300;

    provider = req.body.provider;

    const test = async () => {
        let date = new Date()
        let result = await axios({
            method: 'post', url: `${provider}`, headers: "Content-Type: application/json",
            data: { "jsonrpc": "2.0", "id": 1, "method": "eth_blockNumber", "params": [] }
        });
        let date1 = new Date()
        totalTime += date1 - date
        statusCount[result.status] += 1;
    }
    let promises = [];

    for (let i = 1; i <= count; i++) {
        promises.push(test())
    }

    const result = await Promise.all(promises);
    
    res.send({
        "Avg Time": totalTime / count,
        "Status Code": statusCount
    })
})