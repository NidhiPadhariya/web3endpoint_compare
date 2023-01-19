import express from 'express'
import axios, { AxiosError } from 'axios';

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.post('/compare', async (req, res) => {
    try {
        let statusCount = {
            200: 0,
            304: 0,
            400: 0,
            401: 0,
            403: 0,
            404: 0,
            408: 0,
            420: 0,
            500: 0,
            502: 0,
            503: 0,
            504: 0
        }
        let totalTime = 0;
        let count = 10;

        let provider = req.body.provider;

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
    }
    catch (error) {
        if (error instanceof AxiosError) {
            console.log("axios error")
            res.status(error.response.status).send(`Server responded with ${error.response.status}`)
        }
        else if (error.response.status == 401) {
            console.log(error.response.status, "status code");
            res.status(500).send("server error")
        }
        else if (error.response.status == 500) {
            console.log(error.response.status, "status code");
            res.status(500).send("server error")
        }
        else {
            console.log(error, "error");
            res.status(401).send("server error")
        }
    }
})

export default app