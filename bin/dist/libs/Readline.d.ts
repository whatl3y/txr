/// <reference types="node" />
import readline from 'readline';
import { Readable, Writable } from 'stream';
export default function Readline(inputStream?: Readable, outputStream?: Writable): {
    rl: readline.Interface;
    ask(question: string, close?: boolean): Promise<string>;
    close(): void;
};
