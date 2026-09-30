/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Ensures an external URL starts with http:// or https:// so it opens properly in a new tab
 * instead of being treated as a relative route on the current domain.
 */
export function formatExternalUrl(url?: string): string {
  if (!url) return '#';
  const trimmed = url.trim();
  if (trimmed === '#' || trimmed === '') return '#';
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:')
  ) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export function isValidExternalUrl(url?: string): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  return trimmed !== '' && trimmed !== '#';
}
