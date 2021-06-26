Simple typescript base45 (charset of Qr codes, alphanumeric mode) encoder/decoder.

Run as `npm test` to get an idea of what it does.

Typical use:

```ts
import * as b45 from "base45-ts";

const e = b45.encode(Buffer.from('Hello!','utf-8'))
console.log(e); // Will output %69 VD92EX0"

const d = b45.decode('%69 VD92EX0')
console.log(d); // will output '[72, 101, 108, 108, 111, 33, 33]'

const d = b45.decodeToUtf8String('%69 VD92EX0')
console.log(d); // will output 'Hello!'
```
