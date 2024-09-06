import * as axios from '../utils/axios'

export const getUserRoleManagerAPI = async () => {
  const response = await axios.get('/users/managers')
  return response
}

export const getUserRoleDeliverAPI = async () => {
  const response = await axios.get('/users/shippers')
  return response
}

export const getUserRoleLeaderAPI = async () => {
  const response = await axios.get('/users/leaders')
  return response
}

export const getAllUsersAPI = async () => {
  const response = await axios.get('/users')
  return response
}

export const getUserRoleEmployeesAPI = async () => {
  const response = await axios.get('/users/employees')
  return response
}

export const changeTeamForUserAPI = async (userId, data) => {
  const response = await axios.post(`/users/${userId}/change-department`, data)
  return response
}

export const addRoleForUserAPI = async (userId, data) => {
  const response = await axios.post(`/users/${userId}/roles`, data)
  return response
}

export const getEmployeeByIdAPI = async (userId) => {
  const response = await axios.post(`/users/${userId}`)
  return response
}

export const getRoleUserByIdAPI = async (userId) => {
  const response = await axios.get(`/users/${userId}/roles`)
  return response
}

export const delEmployeeByIdAPI = async (userId) => {
  const response = await axios.post(`/users/${userId}`)
  return response
}
