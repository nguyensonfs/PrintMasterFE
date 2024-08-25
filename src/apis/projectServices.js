import * as axios from '../utils/axios'

export const getAllProjectAPI = async () => {
  const response = await axios.get('/projects')
  return response
}

export const createProjectAPI = async (data) => {
  const response = await axios.post('/projects', data)
  return response
}
