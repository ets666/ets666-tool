const BASE_URL = import.meta.env.VITE_API_URL || ''

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: any
}

export async function request<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', headers = {}, body } = options

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  const response = await fetch(`${BASE_URL}${url}`, config)

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export const api = {
  get: <T>(url: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(url, { ...options, method: 'GET' }),

  post: <T>(url: string, body: any, options?: Omit<RequestOptions, 'method'>) =>
    request<T>(url, { ...options, method: 'POST', body }),

  put: <T>(url: string, body: any, options?: Omit<RequestOptions, 'method'>) =>
    request<T>(url, { ...options, method: 'PUT', body }),

  delete: <T>(url: string, options?: Omit<RequestOptions, 'method'>) =>
    request<T>(url, { ...options, method: 'DELETE' }),
}