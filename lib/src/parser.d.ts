import EventEmitter from "react-native-eventemitter";
export declare class Parser extends EventEmitter {
    private message;
    constructor();
    parse(chunk: string): void;
}
