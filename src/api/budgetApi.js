import { apiRequest } from './client'

export async function getBudgets(token) {
  return apiRequest('/api/budgets', { method: 'GET', token })
}

export async function createBudget(budgetData, token) {
  return apiRequest('/api/budgets', {
    method: 'POST',
    body: JSON.stringify(budgetData),
    token,
  })
}

export async function updateBudget(id, budgetData, token) {
  return apiRequest(`/api/budgets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(budgetData),
    token,
  })
}

export async function deleteBudget(id, token) {
  return apiRequest(`/api/budgets/${id}`, { method: 'DELETE', token })
}