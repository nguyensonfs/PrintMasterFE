export function useErrorHandler() {
  const handleApiError = (error) => {
    const errorMessages = {
      400: 'Yêu cầu không hợp lệ (400)',
      401: 'Không được phép truy cập (401)',
      403: 'Truy cập bị từ chối (403)',
      404: 'Tài nguyên không tìm thấy (404)',
      500: 'Lỗi máy chủ nội bộ (500)',
    }

    const statusCode = error?.status || error?.response?.status

    const errorMessage = error?.data?.message || error?.response?.data?.message

    return (
      errorMessage ||
      errorMessages[statusCode] ||
      `Lỗi không xác định (${statusCode})`
    )
  }

  return {
    handleApiError,
  }
}
