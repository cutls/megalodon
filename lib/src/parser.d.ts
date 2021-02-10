import { EventEmitter } from 'react-native';
export declare class Parser extends EventEmitter {
    private message;
    constructor();
    parse(chunk: string): void;
}
