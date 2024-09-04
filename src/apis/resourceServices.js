import * as axios from '../utils/axios'

export const getResourcesByNameAPI = async (resourceName) => {
  try {
    const response = await axios.get(`/resources`, null, {
      params: {
        resourceName,
      },
    })
    return response
  } catch (error) {
    console.log('🚀 ~ getResourcesByNameAPI ~ error:', error)
    throw error
  }
}
