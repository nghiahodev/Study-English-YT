import constants from '~/config/constants'

const isEmptyFunction = (fn) => {
  return (
    fn.toString().replace(/\s+/g, '') ===
    (() => {}).toString().replace(/\s+/g, '')
  )
}

const getTimeSince = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)

  let interval = Math.floor(seconds / 31536000)
  if (interval >= 1) {
    return `${interval} năm trước`
  }
  interval = Math.floor(seconds / 2592000)
  if (interval >= 1) {
    return `${interval} tháng trước`
  }
  interval = Math.floor(seconds / 86400)
  if (interval >= 1) {
    return `${interval} ngày trước`
  }
  interval = Math.floor(seconds / 3600)
  if (interval >= 1) {
    return `${interval} giờ trước`
  }
  interval = Math.floor(seconds / 60)
  if (interval >= 1) {
    return `${interval} phút trước`
  }
  return `vài giây trước`
}

const getRoboHashUrl = (userId, set = 'set4') => {
  if (!userId) return ''
  return `${constants.ROBOHASH_URL}${userId}?set=${set}`
}

function isoToDateTimeString(isoString) {
  if (!isoString) return ''
  // Chuyển đổi chuỗi ISO 8601 thành đối tượng Date
  const date = new Date(isoString)

  // Kiểm tra tính hợp lệ của đối tượng Date
  if (isNaN(date.getTime())) {
    throw new Error('Invalid ISO string')
  }

  // Lấy các thành phần giờ, phút, ngày, tháng, năm
  const hours = date.getHours().toString().padStart(2, '0') // Giờ (2 chữ số)
  const minutes = date.getMinutes().toString().padStart(2, '0') // Phút (2 chữ số)
  const day = date.getDate().toString().padStart(2, '0') // Ngày (2 chữ số)
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // Tháng (bắt đầu từ 0 nên cần +1)
  const year = date.getFullYear() // Năm

  // Trả về chuỗi định dạng giờ:phút ngày/tháng/năm
  return `${hours}:${minutes} ${day}/${month}/${year}`
}

const util = {
  isEmptyFunction,
  getTimeSince,
  getRoboHashUrl,
  isoToDateTimeString
}
export default util
