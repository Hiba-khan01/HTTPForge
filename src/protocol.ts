import { DynBuf, bufPop } from "./dynbuf";

// Extract one complete message from the buffer.
// Messages are separated by '\n'.
export function cutMessage(buf: DynBuf): Buffer | null {
    // Search only the valid data in the buffer
    const idx = buf.data.subarray(0, buf.length).indexOf("\n");

    // No complete message yet
    if (idx < 0) {
        return null;
    }

    // Copy the complete message
    const msg = Buffer.from(
        buf.data.subarray(0, idx + 1)
    );

    // Remove the message from the buffer
    bufPop(buf, idx + 1);

    return msg;
}