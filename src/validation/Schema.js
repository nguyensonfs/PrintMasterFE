import * as yup from 'yup'
export const loginSchema = yup.object({
  username: yup
    .string()
    .required('Tên đăng nhập là bắt buộc')
    .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
  password: yup
    .string()
    .required('Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
})

export const registrationSchema = yup.object({
  username: yup
    .string()
    .required('Tên đăng nhập là bắt buộc')
    .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
  email: yup.string().required('Email là bắt buộc').email('Email không hợp lệ'),
  password: yup
    .string()
    .required('Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  phoneNumber: yup
    .string()
    .matches(
      /^(?:\+?\d{1,3})?[-.\s]?(?:\(?\d{1,4}\)?[-.\s]?)?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
      'Số điện thoại không hợp lệ'
    ),
  fullname: yup
    .string()
    .required('Họ và tên là bắt buộc')
    .min(3, 'Họ và tên phải có ít nhất 3 ký tự'),
  gender: yup.string().required('Giới tính là bắt buộc'),
  teamId: yup.string().required('Đội ngũ là bắt buộc'),
})

export const forgotPassSchema = yup.object({
  email: yup.string().required('Email là bắt buộc').email('Email không hợp lệ'),
})

export const activatedSchema = yup.object({
  confirmCode: yup.string().required('Confirm code là bắt buộc'),
})

export const updatePasswordSchema = yup.object({
  confirmCode: yup.string().required('Confirm code là bắt buộc'),
  password: yup.string().required('password là bắt buộc'),
  confirmPassword: yup.string().required('Confirm password là bắt buộc'),
})
