export function getCurrentLocale(): string {
  if (typeof navigator !== 'undefined' && navigator.language) {
    return navigator.language
  }

  return 'en-US'
}
