// A dynamically growing buffer

export type DynBuf = {
    data: Buffer;
    length: number;
};

// Append data to the dynamic buffer
export function bufPush(buf: DynBuf, data: Buffer): void {
    const newLen = buf.length + data.length;

    // Grow capacity if needed
    if (buf.data.length < newLen) {
        let cap = Math.max(buf.data.length, 32);

        while (cap < newLen) {
            cap *= 2;
        }

        const grown = Buffer.alloc(cap);

        buf.data.copy(grown, 0, 0);

        buf.data = grown;
    }

    // Copy new data to the end
    data.copy(buf.data, buf.length, 0);

    buf.length = newLen;
}

// Remove data from the front
export function bufPop(buf: DynBuf, len: number): void {
    buf.data.copyWithin(0, len, buf.length);

    buf.length -= len;
}