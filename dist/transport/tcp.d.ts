import { ServerTransport, ClientTransport, MsgId } from './base';
import { Session } from '../session';
import { Server } from '../server';
export declare class TcpServer extends ServerTransport {
    private server;
    private socket?;
    private tcpServer;
    constructor(server: Server, port: number, host?: string);
    onRequest(msgId: MsgId, method: string, params: unknown[]): void;
    onNotify(method: string, params: unknown[]): void;
    sendData(data: Uint8Array): void;
    close(): void;
}
export declare class TcpClient extends ClientTransport {
    private readonly session;
    private readonly port;
    private readonly host;
    private client?;
    private streamProcessor;
    constructor(session: Session<TcpClient>, port: number, host: string);
    connect(): Promise<boolean> | boolean;
    onResponse(msgId: MsgId, error: Error | null, result: unknown): void;
    sendData(data: Uint8Array): void;
    close(): void;
}
