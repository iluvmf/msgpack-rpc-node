import { ClientTransport, MsgId } from './transport/base';
export declare class Session<T extends ClientTransport> {
    private requestTable;
    private generator;
    private transport;
    constructor(builder: new (...args: any) => T, ...builderParams: ConstructorParameters<typeof builder>);
    connect(): boolean | Promise<boolean>;
    call(method: string, ...params: unknown[]): Promise<unknown>;
    notify(method: string, ...params: unknown[]): void;
    onResponse(msgId: MsgId, error: Error | null, result: unknown): void;
    close(): void;
}
