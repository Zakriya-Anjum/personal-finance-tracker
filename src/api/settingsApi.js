import { apiRequest } from './client'

// Same role as transactionApi.js: knows the endpoint, method, and
// body shape for settings, nothing about React/Context/localStorage.

export async function getSettings(token) {
  return apiRequest('/api/settings', {
    method: 'GET',
    token,
  })
}

export async function updateSettings(settingsData, token) {
  return apiRequest('/api/settings', {
    method: 'PUT',
    body: JSON.stringify(settingsData),
    token,
  })
}