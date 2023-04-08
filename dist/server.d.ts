import { ServerTransport, MsgId } from './transport/base';
export declare type Dispatcher = {
    [key: string]: (...args: any[]) => any;
};
export declare class Server {
    private dispatcher;
    transport?: ServerTransport;
    constructor(dispatcher?: Dispatcher);
    serve(dispatcher: Dispatcher): Server;
    listen<T extends ServerTransport>(builder: new (...args: any) => T, ...builderParams: ConstructorParameters<typeof builder>): Server;
    dispatchMethod(msgId: MsgId | null, method: string, params: unknown[], responseFn?: (data: Uint8Array) => void): void;
    close(): void | undefined;
}
