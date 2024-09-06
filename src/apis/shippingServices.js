import * as axios from '../utils/axios'

export const getshippingMethodAPI = async () => {
  const response = await axios.get('/shipping-methods')
  return response
}
