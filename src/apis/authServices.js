import * as axios from '../utils/axios'

export const loginAPI = async (data) => {
  const response = await axios.post('/auth/login', data)
  return response
}

export const updatePasswordAPI = async (data) => {
  const response = await axios.put('/auth/reset-password', data)
  return response
}

export const forgotPasswordAPI = async (email) => {
  const response = await axios.post('/auth/forgot-password', null, {
    params: {
      email,
    },
  })
  return response
}

export const activatedAPI = async (confirmCode) => {
  const response = await axios.post('/auth/activate-account', null, {
    params: {
      confirmCode,
    },
  })
  return response
}

export const registerAPI = async (data) => {
  const response = await axios.post('/auth/register', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response
}
