export interface SignInFormData {
  email: string
  password: string
}

export interface SignUpFormData {
  email: string
  password: string
  fullName: string
}

export interface ResetPasswordFormData {
  email: string
  newPassword: string
  confirmNewPassword: string
  message: string
}
