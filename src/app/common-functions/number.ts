export function formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  export function convertToNumber(number: string): string {
    return number.replace(/,/g, '');
  }