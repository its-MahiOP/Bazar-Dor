export function toBengaliNumber(num: number | string): string {
    if (num === undefined || num === null) return "";
    const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num
        .toString()
        .replace(/\d/g, (digit) => bnDigits[parseInt(digit, 10)]);
}

export function formatPrice(price: number): string {
    const formatted = price.toLocaleString("en-US");
    return toBengaliNumber(formatted) + " টাকা";
}

export function getUnitLabel(unit: string): string {
    switch (unit) {
        case "kg":
            return "প্রতি কেজি";
        case "litre":
            return "প্রতি লিটার";
        case "dozen":
            return "প্রতি ডজন";
        case "piece":
            return "প্রতি পিস";
        default:
            return `প্রতি ${unit}`;
    }
}
