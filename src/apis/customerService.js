import * as axios from '../utils/axios'

export const getCustomersAPI = async () => {
  const response = await axios.get('/customers')
  return response
}
