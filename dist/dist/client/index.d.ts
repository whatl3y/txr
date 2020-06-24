export interface ITxrClient {
    typeInterface: 'cli' | 'library';
    command: 'send' | 'listen' | 'chat';
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
export default function createClient({ typeInterface, // 'cli' or 'library'
command, // 'send', 'listen', or 'chat'
file, // filepath on file system to send to listening user
user, // username to register (if listening) or send file to if sending
targetUser, // username to send chat message to, if command == 'chat'
auth, // if listening and 'cli' interface, whether to request confirmation on receiving a file
host, // host of server to connect to
logger, // node-bunyan logging interface if interface == 'library'
callback, // if provided and using 'library' interface, will be a callback to invoke INSTEAD OF `resolve` when receiving a file as a listening client
reject, // function to invoke if something goes wrong
resolve, }: ITxrClient): Promise<void>;
