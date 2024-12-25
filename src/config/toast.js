import { toast } from 'react-toastify'

const defaultToastConfig = {
  position: 'bottom-right',
  autoClose: 3000,
  hideProgressBar: true,
  closeButton: true,
  closeOnClick: true,
  style: {
    fontSize: '14px',
    width: '400px',
    right: '76px',
    fontFamily: "'Nunito', sans-serif" // Thêm font Nunito
  }
}

const info = (message = 'Info!') => {
  toast.info(message, defaultToastConfig)
}
const success = (message = 'Success!') => {
  toast.success(message, defaultToastConfig)
}

const warning = (message = 'Warning!') => {
  toast.warn(message, defaultToastConfig)
}

const error = (message = 'Error!') => {
  toast.error(message, defaultToastConfig)
}

const loading = (message = 'Vui lòng chờ...') => {
  const id = toast.loading(message, {
    ...defaultToastConfig,
    autoClose: false,
    hideProgressBar: false
  })

  return id
}

const update = (id, message, type = 'success') => {
  toast.update(id, {
    render: message,
    type: type,
    isLoading: false,
    ...defaultToastConfig
  })
}

const stop = (id) => {
  toast.dismiss(id) // Đóng toast dựa trên ID
}

const customToast = {
  info,
  success,
  warning,
  error,
  loading,
  update,
  stop
}
export default customToast
