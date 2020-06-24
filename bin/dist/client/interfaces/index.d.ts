/// <reference types="node" />
import { Readable, Writable } from 'stream';
import socketIo from 'socket.io';
import cli from './cli';
import library from './library';
declare const _default: {
    cli: typeof cli;
    library: typeof library;
};
export default _default;
export interface ITxrInterface {
    reject?: (err?: any) => void;
    resolve?: (foo?: any) => void;
    chat?: ITxrInterfaceChat;
    listen?: ITxrInterfaceListen;
    send?: ITxrInterfaceSend;
}
/**
 * Default export needs to be a function that accepts a single object of the following items:
 *   socket: socket created after connecting to the SocketIO server
 *   socketStream: instance of 'socket.io-stream'
 *   writeStream: the write stream created by socketStream [i.e. `require('socket.io-stream')`]
 *               where the file will be piped to from the file read stream
 *   file: path to file that will be send to the listening client
 *   user: username of the listening user to send the file to
 *   targetUser (OPTIONAL): the user you're sending chat messages to if setting up a chat client
 *   auth (OPTIONAL): boolean to indicate whether a listening client wants to require auth to receive a file
 *   host (OPTIONAL): host to connect to the SocketIO server
 *   logger (OPTIONAL): [Library-only] A logger implementing node-bunyan's logging interface to log information when sending/receiving files using the library
 *   reject: function of what to do at the end of the streaming activities if something went WRONG
 *   resolve: function of what to do at the end of the streaming activities if everything went RIGHT
 **/
export interface ITxrInterfaceOpts {
    socket: socketIo.Socket;
    socketStream: any;
    writeStream: Writable;
    file: string;
    user: string;
    targetUser: string;
    auth?: boolean;
    host?: string;
    logger?: any;
    callback?: (foo?: any) => void;
    reject: (err?: any) => void;
    resolve: (foo?: any) => void;
}
interface ITxrInterfaceChat {
    readline?: any;
    waitAndSendMessage?: () => Promise<void>;
    normal?: ITxrInterfaceNormalChat;
}
interface ITxrInterfaceNormalChat extends ITxrInterfaceChat, ITxrInterfaceNormal {
}
interface ITxrInterfaceNormal {
    'txr-user-taken'?: () => void;
    'txr-no-user'?: (obj: any) => void;
    'txr-file-permission-granted'?: () => void;
    'txr-file-permission-waiting'?: () => void;
    'txr-file-permission-denied'?: () => void;
    'txr-file-data-hash-mismatch'?: () => void;
    'txr-finished-uploading'?: () => void;
    'txr-destination-user-not-registered'?: (user: string) => void;
    'txr-receive-chat-message'?: (opts: IReceiveChatMessageOpts) => Promise<void>;
    'txr-receive-reply'?: (opts: IReceiveReply) => Promise<void>;
    'txr-user-registered-success'?: (name: string) => void;
    'txr-file-permission'?: (fileData: any) => Promise<void>;
    disconnect?: () => void;
}
interface ITxrInterfaceStream {
    'txr-file'?: (stream: Readable, data: any) => void;
    data?: (chunk: any) => void;
    end?: () => void;
}
interface ITxrInterfaceListen {
    readline?: any;
    askToReply?: (targetUser: string) => Promise<void>;
    normal?: ITxrInterfaceNormalListen;
    stream?: ITxrInterfaceStreamListen;
}
interface ITxrInterfaceNormalListen extends ITxrInterfaceListen, ITxrInterfaceNormal {
}
interface ITxrInterfaceStreamListen extends ITxrInterfaceListen, ITxrInterfaceStream {
}
interface ITxrInterfaceSend {
    bytesTracker?: number;
    dataForFileToSend?: any;
    deleteFileAfterSend?: boolean;
    finalFilename?: null | string;
    exitGracefully?(callback: any): Promise<void>;
    normal?: ITxrInterfaceNormalSend;
    stream?: ITxrInterfaceStreamSend;
}
interface ITxrInterfaceNormalSend extends ITxrInterfaceSend, ITxrInterfaceNormal {
}
interface ITxrInterfaceStreamSend extends ITxrInterfaceSend, ITxrInterfaceStream {
}
interface IReceiveChatMessageOpts {
    targetUser: string;
    message: string;
}
interface IReceiveReply {
    user: string;
    replyMessage: string;
}
