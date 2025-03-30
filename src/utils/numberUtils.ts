/**
 * Formats a number with appropriate suffixes (K, M, B, etc.) and optional commas
 * 
 * @param value The number to format
 * @param decimals Number of decimal places to show for values > 1000 (default: 3)
 * @param useCommas Whether to add commas to numbers (default: true)
 * @returns Formatted string representation of the number
 */
export function formatNumber(value: number, decimals: number = 3, useCommas: boolean = true): string {
  // Handle zero or undefined values
  if (!value || value === 0) return '0';
  
  // Define number suffixes
  const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
  
  // If the number is 1000 or less, format without decimals
  if (value < 10) {
    return value.toFixed(2);
  }
  else if (value <= 1000) {
    return useCommas ? Math.floor(value).toLocaleString() : Math.floor(value).toString();
  }
  
  // Calculate the appropriate suffix tier
  const tier = Math.floor(Math.log10(Math.abs(value)) / 3);
  
  // Make sure we don't exceed available suffixes
  const suffix = suffixes[Math.min(tier, suffixes.length - 1)];
  // Scale the number to the appropriate tier
  const scale = Math.pow(10, tier * 3);
  const scaled = value / scale;
  
  // Format the scaled number with exactly 3 decimal places
  let formattedValue = scaled.toFixed(decimals);
  
  // Add commas if requested
  if (useCommas) {
    const parts = formattedValue.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    formattedValue = parts.join('.');
  }
  
  return `${formattedValue}${suffix}`;
} 