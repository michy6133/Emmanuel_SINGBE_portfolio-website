/** Options fetch communes pour les appels admin (cookie de session) */
export const adminFetchOptions: RequestInit = {
  credentials: 'same-origin',
}

export async function adminFetch(input: RequestInfo, init?: RequestInit) {
  return fetch(input, { ...adminFetchOptions, ...init })
}
