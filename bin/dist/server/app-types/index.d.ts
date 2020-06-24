import memory from './memory';
import redis from './redis';
declare const _default: {
    memory: typeof memory;
    redis: typeof redis;
};
export default _default;
export interface ITxrApp {
    app?: any;
    set: (namespace: string, key: string, value: string) => Promise<string>;
    get: (namespace: string, key: null | string) => Promise<string>;
    del: (namespace: string, key: string) => Promise<void>;
    flush?: (namespaces: string[]) => Promise<any>;
}
