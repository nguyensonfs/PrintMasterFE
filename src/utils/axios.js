import axios from 'axios'
const apiUrl = import.meta.env.VITE_ROOT_API
const toast = useToast()

const request = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  function (response) {
    return response.data
  },
  function (error) {
    let res = {}
    if (error.response) {
      res.data = error.response.data
      res.status = error.response.status
      res.headers = error.response.headers

      switch (res.status) {
        case 400:
          if (res.data.message) {
            toast.error(res.data.message)
          }
          if (res.data.title) {
            toast.error(res.data.title)
          }
          break
        case 401:
          if (res.data.message) {
            toast.error(res.data.message)
          }
          if (res.data.title) {
            toast.error(res.data.title)
          }
          break
        case 403:
          if (res.data.message) {
            toast.error(res.data.message)
          }
          if (res.data.title) {
            toast.error(res.data.title)
          }
          break
        case 404:
          if (res.data.message) {
            toast.error(res.data.message)
          }
          if (res.data.title) {
            toast.error(res.data.title)
          }
          break
        case 500:
          if (res.data.message) {
            toast.error(res.data.message)
          }
          if (res.data.title) {
            toast.error(res.data.title)
          }
          break
        default:
          toast.error(`Lỗi ${res.status}: ${res.data.message}`)
          break
      }
    } else if (error.request) {
      toast.error('Không nhận được phản hồi từ server.')
    } else {
      toast.error('Có lỗi xảy ra: ' + error.message)
    }
    return res
  }
)

export const get = async (path, data, options = {}) => {
  const response = await request.get(path, options)
  return response
}
export const post = async (path, data, options = {}) => {
  const response = await request.post(path, data, options)
  return response
}
export const put = async (path, data, options = {}) => {
  const response = await request.put(path, data, options)
  return response
}

export const patch = async (path, data, options = {}) => {
  const response = await request.patch(path, data, options)
  return response
}
export const del = async (path, data, options = {}) => {
  const response = await request.delete(path, options)
  return response
}

export default request
