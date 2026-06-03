"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomInt = void 0;
const crypto_1 = require("crypto");
const getRandomInt = (min, max) => {
    if (!Number.isSafeInteger(min)) {
        throw new RangeError(`The "min" argument must be a safe integer. Received type ${typeof min} (${min})`);
    }
    if (!Number.isSafeInteger(max)) {
        throw new RangeError(`The "max" argument must be a safe integer. Received type ${typeof max} (${max})`);
    }
    if (min >= max) {
        throw new RangeError(`The value of "max" is out of range. It must be greater than the value of "min" (${min}). Received ${max}`);
    }
    const MAX_RANGE_32_BITS = 0xffffffff + 1;
    const range = max - min;
    if (range > MAX_RANGE_32_BITS) {
        throw new RangeError(`This function only provide 32 bits of entropy, therefore range cannot be more then 2^32.`);
    }
    const getRandomValues = typeof window !== 'undefined'
        ? (array) => {
            try {
                return window.crypto.getRandomValues(array);
            } catch (e) {
                console.error('Window crypto error:', e);
                throw e;
            }
        }
        : typeof self !== 'undefined'
            ? (array) => {
                try {
                    return self.crypto.getRandomValues(array);
                } catch (e) {
                    console.error('Self crypto error:', e);
                    throw e;
                }
            }
            : (array) => {
                try {
                    return (0, crypto_1.getRandomValues)(array);
                } catch (e) {
                    console.error('Node crypto error:', e);
                    throw e;
                }
            };
    const array = new Uint32Array(1);
    const maxRange = MAX_RANGE_32_BITS - (MAX_RANGE_32_BITS % range);
    let randomValue;
    do {
        getRandomValues(array);
        randomValue = array[0];
    } while (randomValue >= maxRange);
    return min + (randomValue % range);
};
exports.getRandomInt = getRandomInt;
//# sourceMappingURL=getRandomInt.js.map