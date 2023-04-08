import { ServerTransport, ClientTransport, MsgId } from './base';
import { Session } from '../session';
import { Server } from '../server';
export declare class UnixServer extends ServerTransport {
    private server;
    private socket?;
    private socketServer;
    constructor(server: Server, path: string);
    onRequest(msgId: MsgId, method: string, params: unknown[]): void;
    onNotify(method: string, params: unknown[]): void;
    sendData(data: Uint8Array): void;
    close(): void;
}
export declare class UnixClient extends ClientTransport {
    private readonly session;
    private readonly path;
    private client?;
    constructor(session: Session<UnixClient>, path: string);
    connect(): Promise<boolean> | boolean;
    onResponse(msgId: MsgId, error: Error | null, result: unknown): void;
    sendData(data: Uint8Array): void;
    close(): void;
}
