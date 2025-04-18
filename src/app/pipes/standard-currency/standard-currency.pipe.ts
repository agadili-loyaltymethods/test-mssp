import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'standardCurrency',
  standalone: true
})
export class StandardCurrencyPipe implements PipeTransform {

    transform(
    value: number | null | undefined,
    digitsInfo: string = '1.2-2',
    currencyCode: string = 'USD',
    symbol: boolean = true,
  ): string {
    // Handle null or undefined value
    if (value == null) return '';

    // Extract minimum and maximum fraction digits from digitsInfo
    const digitsMatch = digitsInfo.match(/^(\d+)\.(\d+)-(\d+)$/);
    const minimumFractionDigits = digitsMatch ? parseInt(digitsMatch[2], 10) : 2;
    const maximumFractionDigits = digitsMatch ? parseInt(digitsMatch[3], 10) : 2;

    // Validate fraction digits
    if (maximumFractionDigits > 20 || minimumFractionDigits > maximumFractionDigits) {
      throw new Error('Invalid fraction digit range in digitsInfo');
    }

    // Create the Intl.NumberFormat object
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits,
      maximumFractionDigits,
      currencyDisplay: symbol ? 'symbol' : 'code'
    });

    return formatter.format(value);
  }
}
