export function detectOs() {
  if (typeof navigator === "undefined") return null;
  const source = [navigator.userAgentData?.platform, navigator.platform, navigator.userAgent]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  if (/iphone|ipad|ipod|android|mobile/.test(source)) return null;
  if (/mac/.test(source)) return "mac";
  if (/win/.test(source)) return "windows";
  if (/linux|x11|cros/.test(source)) return "linux";
  return null;
}
