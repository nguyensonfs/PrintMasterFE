import * as axios from '../utils/axios'

export const getTeamAPI = async () => {
  const response = await axios.get('/teams')
  return response
}

export const createTeamAPI = async (data) => {
  const response = await axios.post('/teams', data)
  return response
}

export const delTeamAPI = async (teamId) => {
  const response = await axios.del(`/teams/${teamId}`)
  return response
}
export const updateTeamAPI = async (teamId, data) => {
  const response = await axios.put(`/teams/${teamId}`, data)
  return response
}

export const changeManagerTeamAPI = async (teamId, managerId) => {
  const response = await axios.patch(`/teams/${teamId}/change-manager`, null, {
    params: {
      managerId,
    },
  })
  return response
}
