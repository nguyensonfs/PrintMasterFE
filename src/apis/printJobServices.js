import * as axios from '../utils/axios'

export const createPrintJobsAPI = async (data) => {
  const response = await axios.post('/print-jobs', data)
  return response
}
