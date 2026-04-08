function tlv(id: string, value: string) {
  return id + value.length.toString().padStart(2, "0") + value;
}

function crc16(str: string): string {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
    }
    crc &= 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export function generatePixPayload(opts: {
  pixKey: string;
  merchantName: string;
  merchantCity: string;
  amount: number;
  description?: string;
}): string {
  const gui = tlv("00", "br.gov.bcb.pix");
  const key = tlv("01", opts.pixKey);
  const desc = opts.description ? tlv("02", opts.description) : "";
  const mai = tlv("26", gui + key + desc);

  let payload =
    tlv("00", "01") +
    mai +
    tlv("52", "0000") +
    tlv("53", "986") +
    tlv("54", opts.amount.toFixed(2)) +
    tlv("58", "BR") +
    tlv("59", opts.merchantName) +
    tlv("60", opts.merchantCity) +
    tlv("62", tlv("05", "***"));

  payload += "6304";
  payload += crc16(payload);
  return payload;
}
