import * as axios from '../utils/axios'

export const getAllProjectAPI = async () => {
  const response = await axios.get('/projects')
  return response
}

export const createProjectAPI = async (data) => {
  const response = await axios.post('/projects', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response
}

export const createProjectDesignAPI = async (projectId, data) => {
  const response = await axios.post(`/projects/${projectId}/designs`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response
}

export const approvedProjectDesignAPI = async (projectId, designId, data) => {
  const response = await axios.patch(
    `/projects/${projectId}/designs/${designId}/approval`,
    data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
  return response
}
