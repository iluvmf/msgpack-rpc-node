/// <reference types="node" />
import * as dgram from 'dgram';
import { ServerTransport, ClientTransport, MsgId } from './base';
import { Session } from '../session';
import { Server } from '../server';
export declare class UdpServer extends ServerTransport {
    private server;
    private udpServer;
    private remote?;
    constructor(server: Server, port: number, host?: string, socketType?: dgram.SocketType);
    onRequest(msgId: MsgId, method: string, params: unknown[]): void;
    onNotify(method: string, params: unknown[]): void;
    sendData(data: Uint8Array): void;
    close(): void;
}
export declare class UdpClient extends ClientTransport {
    private readonly session;
    private readonly port;
    private readonly host;
    private readonly socketType;
    private client?;
    constructor(session: Session<UdpClient>, port: number, host: string, socketType?: dgram.SocketType);
    connect(): Promise<boolean> | boolean;
    onResponse(msgId: MsgId, error: Error | null, result: unknown): void;
    sendData(data: Uint8Array): void;
    close(): void;
}
