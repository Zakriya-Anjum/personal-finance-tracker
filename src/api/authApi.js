import { apiRequest } from './client'

// This file knows WHICH backend authentication endpoints exist and
// WHAT shape of data they expect/return. It does not know about React,
// Context, tokens being stored, or authenticated state — that's
// AuthContext's job. This function only translates "register a user"
// into the actual HTTP call, using the shared apiRequest() helper
// instead of a raw fetch().

export async function registerUser(name, email, password) {
  return apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
}

export async function loginUser(email, password) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}