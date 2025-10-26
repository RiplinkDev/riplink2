export const dropsFromXrp = (xrp: number) => Math.round(xrp * 1_000_000);
export const xrpFromDrops = (drops: number) => drops / 1_000_000;
