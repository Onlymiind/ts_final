export function escapeCsvValue(value: string | number): string {
    if (typeof value == 'number') {
        value = value.toString()
    }

    return `"${value.replace(/\"/g, "\"\"")}"`
}
