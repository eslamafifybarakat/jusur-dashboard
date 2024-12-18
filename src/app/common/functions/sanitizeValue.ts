export function sanitizeValue(value: any): string {
    return (value === null || value === 'null' || value === undefined) ? '' : value;
  }