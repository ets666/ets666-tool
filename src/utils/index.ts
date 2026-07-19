import { ref, watch } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const storedValue = localStorage.getItem(key)
  const value = ref<T>(storedValue ? JSON.parse(storedValue) : defaultValue) as any

  watch(value, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue))
  }, { deep: true })

  return value
}

export function formatDate(date: Date | string, format: string = 'YYYY-MM-DD'): string {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function (this: any, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

/**
 * Convert hex encoded string to utf8 string
 * ETS2 profile directory names are hex encoded
 */
export function hex2utf8(hex: string): string {
  try {
    let str = ''
    for (let i = 0; i < hex.length; i += 2) {
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
    }
    return decodeURIComponent(escape(str))
  } catch (e) {
    return hex
  }
}

/**
 * Check if the data represents an error
 */
export function errCatch(data: any, keyword?: string): boolean {
  if (data && typeof data === 'object' && data.error) {
    return true
  }
  if (data === 'invalidPath') {
    return true
  }
  if (typeof data === 'string' && data.includes('Error')) {
    return true
  }
  if (keyword && typeof data === 'string' && !data.includes(keyword)) {
    return true
  }
  return false
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let inThrottle = false

  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), wait)
    }
  }
}
