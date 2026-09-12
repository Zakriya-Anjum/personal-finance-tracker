import { apiRequest } from './client'

// This file knows WHICH transaction endpoint to call, WHAT HTTP
// method it needs, and WHAT shape of data it expects/returns — the
// same role authApi.js plays for authentication. It does not know
// about React, Context, or where the token comes from; the caller
// (TransactionContext) is responsible for supplying a valid token.

export async function getTransactions(token) {
  return apiRequest('/api/transactions', {
    method: 'GET',
    token,
  })
}

export async function createTransaction(transactionData, token) {
  return apiRequest('/api/transactions', {
    method: 'POST',
    body: JSON.stringify(transactionData),
    token,
  })
}

export async function updateTransaction(id, transactionData, token) {
  return apiRequest(`/api/transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(transactionData),
    token,
  })
}

export async function deleteTransaction(id, token) {
  return apiRequest(`/api/transactions/${id}`, {
    method: 'DELETE',
    token,
  })
}