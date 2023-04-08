import { ClientTransport } from './transport/base';
import { Session } from './session';
export declare class Client<T extends ClientTransport> extends Session<T> {
    constructor(builder: new (...args: any) => T, ...builderParams: ConstructorParameters<typeof builder>);
}
