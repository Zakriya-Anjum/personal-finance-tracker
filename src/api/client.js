const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// A small structured error instead of a plain Error. This is additive,
// not breaking: ApiError still has a normal .message, so every
// existing `catch (error) { ... error.message }` call site keeps
// working unchanged. What's new is `.errors` (the backend's per-field
// validation array, when present) and `.status` (the HTTP status
// code) — callers that want that detail can now read it; callers that
// don't can ignore it exactly as before. client.js still doesn't
// decide how any of this is DISPLAYED — that stays entirely in the UI
// layer, this just stops throwing away information the backend
// already computed.
export class ApiError extends Error {
  constructor(message, { status, errors } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors || null
  }
}

export async function apiRequest(path, options = {}) {
  const { token, headers, ...restOptions } = options

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...restOptions,
  })

  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const errorMessage = data?.message || 'Something went wrong'
    throw new ApiError(errorMessage, {
      status: response.status,
      errors: data?.errors,
    })
  }

  return data
}