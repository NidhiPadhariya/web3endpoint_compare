import request from "supertest";
import app from "../app";
import { jest } from '@jest/globals'
import axios from 'axios';


describe('POST /compare', () => {
    it('should return the average time and status codes for calling a web3 endpoint', async () => {
        const res = await request(app)
            .post('/compare')
            .send({ provider: 'https://goerli.infura.io/v3/01edf611a74d4ff5b73cec0a354fee07' });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('Avg Time');
        expect(res.body).toHaveProperty('Status Code');
    }, 60_000);

    it('should return a 401 status code when the web3 endpoint returns a 401 status code', async () => {
        const mockEndpoint = jest.fn().mockRejectedValue({ status: 401 });
        axios.post = mockEndpoint;

        const res = await request(app)
            .post('/compare')
            .send({ provider: 'https://goerli.infura.io/v3/' });

        expect(res.statusCode).toEqual(401);
    });

    it('should return a 403 status code when the web3 endpoint returns a 403 status code', async () => {
        const mockEndpoint = jest.fn().mockRejectedValue({ status: 403 });
        axios.post = mockEndpoint;

        const res = await request(app)
            .post('/compare')
            .send({ provider: 'https://goerli.infura.io/v2/e41349bdbb44419d8d39e30ed329c8f2' });

        expect(res.statusCode).toEqual(403);
    }, 80_000);

    it('should return a 500 status code when the web3 endpoint returns a 500 status code', async () => {
        const mockEndpoint = jest.fn().mockRejectedValue({ status: 500 });
        axios.post = mockEndpoint;

        const response = await request(app).post({
            url: 'https://goerli.infura.io/v3/01edf611a74d4ff5b73cec0a354fee07',
            json: { key: 'value' },
        }, (error, response, body) => {
            expect(response.statusCode).toEqual(500);
        });
    });
});