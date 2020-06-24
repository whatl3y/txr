import chat from './chat';
import listen from './listen';
import send from './send';
declare const _default: {
    chat: typeof chat;
    listen: typeof listen;
    send: typeof send;
};
export default _default;
export interface ICommandOptions {
    client: any;
    file: string;
    user: string;
    targetUser?: string;
    auth?: boolean;
    host?: string;
    logger?: any;
    callback?: (foo?: any) => void;
    reject?: (err: string | Error) => void;
    resolve?: (foo?: any) => void;
}
