/// <reference types="node" />
/// <reference types="node" />
export declare type MsgId = number;
interface BaseTransport {
    sendData: (data: any) => void;
    close: () => void;
}
export declare abstract class ServerTransport implements BaseTransport {
    abstract sendData(data: any): void;
    abstract close(): void;
    abstract onRequest(msgId: MsgId, method: string, ...params: unknown[]): void;
    abstract onNotify(method: string, ...params: unknown[]): void;
    onRead(data: Buffer): void;
}
export declare abstract class ClientTransport implements BaseTransport {
    abstract sendData(data: any): void;
    abstract close(): void;
    abstract onResponse(msgId: MsgId, error: Error, result: unknown): void;
    abstract connect(): boolean | Promise<boolean>;
    onRead(data: Buffer | unknown): void;
}
export {};
