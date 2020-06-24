/// <reference types="node" />
import socketIo from 'socket.io';
import { Readable } from 'stream';
export interface IListeners {
    normal: INormalListers;
    stream: IStreamListeners;
}
export default function listeners(io: socketIo.Server, socket: socketIo.Socket, socketApp: any): IListeners;
interface INormalListers {
    'txr-regiser-listen': (opts: IRegsiterListenOpts) => Promise<void>;
    'txr-send-file-check-auth': (opts: ISendFileCheckAuthOpts) => Promise<void>;
    'txr-send-chat-message': (opts: ISendChatMessageOpts) => Promise<void>;
    'txr-reply-to-chat-message': (opts: IReplyToChatMessageOpts) => Promise<void>;
    disconnect: () => Promise<void>;
}
interface IStreamListeners {
    'txr-upload': (stream: Readable, data: any) => Promise<void>;
}
interface IRegsiterListenOpts {
    auth: boolean;
    user: string;
}
interface ISendFileCheckAuthOpts {
    filename: string;
    filesizebytes: number;
    user: string;
}
interface ISendChatMessageOpts {
    targetUser: string;
    user: string;
    message: string;
}
interface IReplyToChatMessageOpts {
    user: string;
    replyMessage: string;
}
export {};
