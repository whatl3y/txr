/// <reference types="node" />
import http from 'http';
import { ITxrApp } from './app-types';
export default function createServer(port: number, opts?: any): {
    app: import("express-serve-static-core").Express;
    httpServer: http.Server;
    socketApp: ITxrApp;
};
