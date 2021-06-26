import { deepStrictEqual, strictEqual, throws } from "assert";
import * as b45 from "../lib/base45.js";

describe("RFC examples", () => {
    it("encode array -empty-", () => strictEqual(b45.encode(new Uint8Array([])), ""));
    it("encode array {0}", () => strictEqual(b45.encode(new Uint8Array([0])), "00"));
    it("encode array {0,0}", () => strictEqual(b45.encode(new Uint8Array([0, 0])), "000"));
    it("encode array {lots}", () => strictEqual(b45.encode(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])), "000000000000000000"));

    it("encode example 1 - Hello!!", () => strictEqual(b45.encode(Buffer.from("Hello!!", "utf-8")), "%69 VD92EX0"));
    it("encode example 2 - base-45", () => strictEqual(b45.encode(Buffer.from("base-45", "utf-8")), "UJCLQE7W581"));
    it("encode example 3 - ietf!", () => strictEqual(b45.encode(Buffer.from("ietf!", "utf-8")), "QED8WEX0"));

    it("decode - bad length 1", () => throws(() => b45.decode("1"), /length 1/));
    it("decode - bad length 4", () => throws(() => b45.decode("1234"), /length 4/));
    it("decode - invalid characters 0", () => throws(() => b45.decode("^1"), /Invalid character '\^' at position 0/));
    it("decode - invalid characters 1", () => throws(() => b45.decode("0^"), /Invalid character '\^' at position 1/));
    it("decode - invalid characters 10", () => throws(() => b45.decode("0123456789&"), /Invalid character '&' at position 10/));

    it("decode -empty-", () => deepStrictEqual(b45.decode(""), new Uint8Array([])));
    it("decode 00", () => deepStrictEqual(b45.decode("00"), new Uint8Array([0])));
    it("decode 000", () => deepStrictEqual(b45.decode("000"), new Uint8Array([0, 0])));

    it("decode example 1 - %69 VD92EX0 -> Hello!!", () => deepStrictEqual(b45.decode("%69 VD92EX0"), new Uint8Array([72, 101, 108, 108, 111, 33, 33])));
    it("decode example 2 - UJCLQE7W581 -> base-45", () => deepStrictEqual(b45.decode("UJCLQE7W581"), new Uint8Array([98, 97, 115, 101, 45, 52, 53])));
    it("decode example 3 - QED8WEX0 ->ietf!", () => deepStrictEqual(b45.decode("QED8WEX0"), new Uint8Array([105, 101, 116, 102, 33])));

    it("decode convenience - UJCLQE7W581 -> base-45", () => strictEqual(b45.decodeToUtf8String("UJCLQE7W581"), "base-45"));
});
