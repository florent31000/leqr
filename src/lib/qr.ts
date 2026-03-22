import QRCode from "qrcode";

export interface QROptions {
  data: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  errorCorrection?: "L" | "M" | "Q" | "H";
  margin?: number;
}

export async function generateQRDataURL(opts: QROptions): Promise<string> {
  const {
    data,
    size = 400,
    fgColor = "#000000",
    bgColor = "#ffffff",
    errorCorrection = "M",
    margin = 2,
  } = opts;

  return QRCode.toDataURL(data, {
    width: size,
    margin,
    color: { dark: fgColor, light: bgColor },
    errorCorrectionLevel: errorCorrection,
  });
}

export async function generateQRSVG(opts: QROptions): Promise<string> {
  const {
    data,
    fgColor = "#000000",
    bgColor = "#ffffff",
    errorCorrection = "M",
    margin = 2,
  } = opts;

  return QRCode.toString(data, {
    type: "svg",
    margin,
    color: { dark: fgColor, light: bgColor },
    errorCorrectionLevel: errorCorrection,
  });
}

export async function generateQRBuffer(opts: QROptions): Promise<Buffer> {
  const {
    data,
    size = 1000,
    fgColor = "#000000",
    bgColor = "#ffffff",
    errorCorrection = "H",
    margin = 2,
  } = opts;

  return QRCode.toBuffer(data, {
    width: size,
    margin,
    color: { dark: fgColor, light: bgColor },
    errorCorrectionLevel: errorCorrection,
  });
}
