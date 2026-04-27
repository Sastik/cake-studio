import type { CartLine } from "../state/cart";

function encode(text: string) {
  return encodeURIComponent(text);
}

export function buildWhatsAppUrl(args: {
  phoneNumber: string;
  businessName: string;
  cartLines: CartLine[];
  notes?: string;
  customRequest?: {
    occasion?: string;
    flavors?: string;
    size?: string;
    budget?: string;
    date?: string;
    message?: string;
  };
}) {
  const { phoneNumber, businessName, cartLines, notes, customRequest } = args;
  const lines: string[] = [];
  lines.push(`Hi ${businessName}! I'd like to place an order:`);

  if (cartLines.length > 0) {
    lines.push("");
    lines.push("Cart:");
    for (const line of cartLines) {
      lines.push(`- ${line.name} × ${line.qty} (₹${line.price})`);
    }
  }

  if (customRequest) {
    const items: [string, string | undefined][] = [
      ["Occasion", customRequest.occasion],
      ["Flavors", customRequest.flavors],
      ["Size", customRequest.size],
      ["Budget", customRequest.budget],
      ["Delivery date", customRequest.date],
    ];
    const hasAny = items.some(([, v]) => Boolean(v)) || Boolean(customRequest.message);
    if (hasAny) {
      lines.push("");
      lines.push("Custom cake request:");
      for (const [k, v] of items) {
        if (v) lines.push(`- ${k}: ${v}`);
      }
      if (customRequest.message) lines.push(`- Notes: ${customRequest.message}`);
    }
  }

  if (notes) {
    lines.push("");
    lines.push(`Extra notes: ${notes}`);
  }

  lines.push("");
  lines.push("Please confirm availability, total, and delivery/pickup details. Thank you!");

  const text = encode(lines.join("\n"));
  const normalized = phoneNumber.replace(/[^\d]/g, "");
  return `https://wa.me/${normalized}?text=${text}`;
}

