[![npm](https://img.shields.io/npm/v/base45-ts)](https://www.npmjs.com/package/base45-ts)

# base45 typescript implementation

Simple typescript base45 (charset of Qr codes, alphanumeric mode) encoder/decoder.

Run as `npm test` to get an idea of what it does.

Typical use:

```ts
import * as b45 from "base45-ts";

const buffer : Uint8Array = new TextEncoder().encode('Hello!')
const e : string = b45.encode(buffer);
console.log(e); // Will output %69 VD92EX0"

const d = b45.decode('%69 VD92EX0')
console.log(d); // will output 'Uint8Array(7) [72, 101, 108, 108, 111, 33, 33]'

const d = b45.decodeToUtf8String('%69 VD92EX0')
console.log(d); // will output 'Hello!'
```
