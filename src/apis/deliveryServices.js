import * as axios from '../utils/axios'

export const getDeliveriesAPI = async () => {
  const response = await axios.get('/deliveries')
  return response
}

export const getDeliveryByProjectIdAPI = async (projectId) => {
  const response = await axios.get(`/deliveries`, null, {
    params: {
      projectId,
    },
  })
  return response
}

export const getDeliveryByIdAPI = async (deliveryId) => {
  const response = await axios.get(`/deliveries/${deliveryId}`)
  return response
}

export const createDeliveryAPI = async (data) => {
  const response = await axios.post('/deliveries', data)
  return response
}

export const confirmAssignmentAPI = async (deliveryId) => {
  const response = await axios.patch(
    `/deliveries/${deliveryId}/confirm-assignment`
  )
  return response
}

export const confirmDeliveryAPI = async (deliveryId, data) => {
  const response = await axios.patch(
    `/deliveries/${deliveryId}/confirm-delivery`,
    data
  )
  return response
}
