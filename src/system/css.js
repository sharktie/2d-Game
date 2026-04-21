export function css(hex) {
  hex = hex.trim().replace("#", "").toLowerCase();

  if (hex.length === 3) {
    hex = hex.split("").map(c => c + c).join("");
  }

  return parseInt("0x" + hex);
}