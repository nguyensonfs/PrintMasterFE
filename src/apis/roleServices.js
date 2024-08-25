import * as axios from '../utils/axios'

export const getRolesAPI = async () => {
  const response = await axios.get('/roles')
  return response
}
