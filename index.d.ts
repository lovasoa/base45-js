declare module 'base45-js' {
    export function b45encode(buffer: ArrayBuffer): string;
    export function b45decode(str: string): ArrayBuffer;
}
