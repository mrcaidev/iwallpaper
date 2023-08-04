const key = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

export function buildBlurDataUrl(blur: string) {
  return `data:image/gif;base64,R0lGODlhAQABAPAA${blur}/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;
}

export function generateBlur(color: string) {
  const red = parseInt(color.slice(1, 3), 16);
  const green = parseInt(color.slice(3, 5), 16);
  const blue = parseInt(color.slice(5, 7), 16);
  return generateTriplet(0, red, green) + generateTriplet(blue, 255, 255);
}

function generateTriplet(e1: number, e2: number, e3: number) {
  return (
    key[e1 >> 2]! +
    key[((e1 & 3) << 4) | (e2 >> 4)]! +
    key[((e2 & 15) << 2) | (e3 >> 6)]! +
    key[e3 & 63]!
  );
}
