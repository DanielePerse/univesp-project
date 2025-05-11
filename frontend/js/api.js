import getAuthHeaders from './utils';

const BASE_URL = 'http://localhost:5000'; // ajuste conforme necessário

export async function login(email, password) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message || 'Login failed');
  }

  return await response.json();
}

export async function checkCpfExists(cpf) {
  const response = await fetch(`${BASE_URL}/check-cpf/${cpf}`, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error('Error checking CPF');
  }

  return await response.json(); // deve retornar { exists: true/false }
}

export async function registerEmployee(employeeData) {
  const response = await fetch(`${BASE_URL}/employees`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(employeeData)
  });

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message || 'Error registering employee');
  }

  return await response.json();
}

export async function listEmployees() {
  const response = await fetch(`${BASE_URL}/employees`, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error('Error fetching employees');
  }

  return await response.json();
}

export async function getEmployeeDetails(employeeId) {
  const response = await fetch(`${BASE_URL}/employees/${employeeId}`, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error('Error fetching employee details');
  }

  return await response.json();
}

export async function updateEmployee(employeeId, updatedData) {
  const response = await fetch(`${BASE_URL}/employees/${employeeId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updatedData)
  });

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message || 'Error updating employee');
  }

  return await response.json();
}
