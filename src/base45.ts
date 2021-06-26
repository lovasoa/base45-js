const baseSize = 45;
const baseSizeSquared = 2025;
const chunkSize = 2;
const encodedChunkSize = 3;
const smallEncodedChunkSize = 2;
const byteSize = 256;

const encoding = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:".split('');
const decoding = Object.fromEntries(encoding.map((l, i) => [l, i]));

/**
 * Encode binary data to base45
 * @param byteArrayArg An array of bytes to encode 
 * @returns a base45-encoded string
 */
export function encode(byteArrayArg: Uint8Array | number[]): string {
    const wholeChunkCount = (byteArrayArg.length / chunkSize | 0);
    const resultSize = wholeChunkCount * encodedChunkSize + (byteArrayArg.length % chunkSize === 1 ? smallEncodedChunkSize : 0);

    const result = new Array(resultSize);
    let resultIndex = 0;
    const wholeChunkLength = wholeChunkCount * chunkSize;
    for (let i = 0; i < wholeChunkLength;) {
        const value = byteArrayArg[i++] * byteSize + byteArrayArg[i++];
        result[resultIndex++] = encoding[value % baseSize];
        result[resultIndex++] = encoding[(value / baseSize | 0) % baseSize];
        result[resultIndex++] = encoding[(value / baseSizeSquared | 0) % baseSize];
    }

    if (byteArrayArg.length % chunkSize) {
        result[result.length - 2] = encoding[byteArrayArg[byteArrayArg.length - 1] % baseSize];
        result[result.length - 1] =
            byteArrayArg[byteArrayArg.length - 1] < baseSize
                ? encoding[0]
                : encoding[(byteArrayArg[byteArrayArg.length - 1] / baseSize | 0) % baseSize];
    }

    return result.join("");
};

/**
 * Decode a base45-encoded string
 * @param utf8StringArg A base45-encoded string 
 * @returns a typed array containing the decoded data
 */
export function decode(utf8StringArg: string): Uint8Array {
    if (utf8StringArg.length === 0) return new Uint8Array;

    const remainderSize = utf8StringArg.length % encodedChunkSize;
    if (remainderSize === 1)
        throw new Error(`A string of length ${utf8StringArg.length} is not valid base45: ${utf8StringArg}`);

    const buffer = new Uint8Array(utf8StringArg.length);
    for (let i = 0; i < utf8StringArg.length; ++i) {
        const char = utf8StringArg[i];
        const found = decoding[char];
        if (found === undefined)
            throw new Error(`Invalid character '${char}' at position ${i}.`);
        buffer[i] = found;
    }

    const wholeChunkCount = (buffer.length / encodedChunkSize | 0);
    const result = new Uint8Array(wholeChunkCount * chunkSize + (remainderSize === chunkSize ? 1 : 0));
    let resultIndex = 0;
    const wholeChunkLength = wholeChunkCount * encodedChunkSize;
    for (let i = 0; i < wholeChunkLength;) {
        const val = buffer[i++] + baseSize * buffer[i++] + baseSizeSquared * buffer[i++];
        result[resultIndex++] = (val / byteSize | 0); //result is always in the range 0-255 - % ByteSize omitted.
        result[resultIndex++] = val % byteSize;
    }

    if (remainderSize)
        result[result.length - 1] = buffer[buffer.length - 2] + baseSize * buffer[buffer.length - 1]; //result is always in the range 0-255 - % ByteSize omitted.

    return result;
}

/**
 * Same as decode, but returns a string instead of a typed array.
 * If the base45-encoded data was not valid UTF-8, throws an error.
 * @param utf8StringArg base45-encoded string representing an utf8 string
 * @returns the decoded string
 */
export function decodeToUtf8String(utf8StringArg: string): string {
    return new TextDecoder().decode(decode(utf8StringArg));
}

