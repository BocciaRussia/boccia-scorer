import axios from "axios";
import os from 'os'
import { Query, QueryParams } from "./Query";

import Player from "boccia-types/lib/Player";
import store from "@/store";

let instance: ServerAPI | null = null;

export class ServerAPI {

    private server: string | null = null
    private port = 2007;
    private queries: Query[] = []
    static get instance() {
        if (instance == null) {
            instance = new ServerAPI
        }
        return instance
    }
    constructor() {
        this.searchServer()
    }
    getPlayers(): Promise<Player[]> {
        return <Promise<Player[]>><unknown>this.query('players', 'GET')
    }
    startMatch() {
        console.log(store.getters.match);

        return this.query('startMatch', 'POST', {
            match: store.getters.match
        })

    }
    sendEnd() {

        return this.query('sendEnd', 'POST', {
            match: store.getters.match
        })
    }
    sendMatch() {

        return this.query('sendMatch', 'POST', {
            match: store.getters.match
        })
    }
    private query(endPoint: string, method: 'GET' | 'POST', params?: QueryParams) {
        return new Promise((resolve, reject) => {

            if (this.server == null) {
                this.queries.push(new Query(endPoint, method, params || {}, (error, data) => {
                    if (error) return reject(error)
                    resolve(data)
                }))
            } else {
                const url = this.server + '/' + endPoint;
                if (method === 'GET')
                    resolve((axios.get(url, {
                        params
                    })).then(({ data }) => data))
                else if (method === 'POST') {
                    resolve((axios.post(url, params)).then(({ data }) => data))

                }
            }
        })
    }

    private async searchServer() {
        const localIp = this.localIp;
        const address = `http://127.0.0.1:${this.port}`;

        if (await this.checkReqeust(address)) {
            this.server = address
            this.startSendQueries();
            return
        }
        const searchStr = localIp.split('.').slice(0, -1).join('.') + '.'
        for (let i = 1; i < 255; i++) {
            const address = `http://${searchStr + i}:${this.port}`;
            if (await this.checkReqeust(address)) {
                this.server = address
                this.startSendQueries();
                return
            }
        }
        this.rejectSaveQueries()
    }
    private async checkReqeust(address: string) {
        try {
            const { data } = await axios.get(`${address}/check`, {
                timeout: 200
            })
            if (data === 'checked') {
                return true;

            }
        } catch (error) {
            return false
        }
        return false;
    }
    rejectSaveQueries() {
        while (this.queries.length > 0) {
            const query = this.queries.shift()
            if (!query) break;
            query.callback(new Error('offline mode'))
        }
    }
    async startSendQueries() {

        while (this.queries.length > 0) {
            const query = this.queries.shift()
            if (!query) break;
            try {

                const res = await this.query(query.endPoint, query.method, query.query)
                query.callback(null, res)
            } catch (error) {
                query.callback(error, null)
            }
        }
    }
    private get localIp(): string {
        const nets = os.networkInterfaces();
        const results = Object.create(null); // Or just '{}', an empty object

        for (const name in nets) {

            if (nets[name] == undefined) continue;
            for (const net of nets[name]!) {

                // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
                if (net.family === 'IPv4' && !net.internal) {
                    if (!results[name]) {
                        results[name] = [];
                    }
                    results[name].push(net.address);
                }
            }
        }
        return results[Object.keys(results).find(s => s.includes('en'))!][0]
    }
}