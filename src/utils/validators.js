export function isValidBase64(str) {
  try {
    return (
      Buffer.from(str, "base64").toString("base64") === str.replace(/\s/g, "")
    );
  } catch {
    return false;
  }
}
