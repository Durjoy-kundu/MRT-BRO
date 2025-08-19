/**
 * Example: we expect a Text record like "BAL:250.50"
 * but we also try to parse the first text record if present.
 */
export function parseBalanceFromNDEFMessage(message) {
  try {
    for (const record of message.records) {
      if (record.recordType === "text") {
        const text = textDecoder(record);
        const match = text.match(/BAL:\s*([0-9]+(?:\.[0-9]+)?)/i);
        if (match) return parseFloat(match[1]);
        // fallback: if it's only a number
        const num = parseFloat(text);
        if (!Number.isNaN(num)) return num;
      }
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

function textDecoder(record) {
  // Web NFC text records are well-formed: payload is UTF-8 with language code
  // But on some devices, you might get different encodings; keep simple here.
  const textDecoder = new TextDecoder(record.encoding || "utf-8");
  return textDecoder.decode(record.data);
}
