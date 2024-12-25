// Import thư viện dayjs
import dayjs from 'dayjs/esm'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

// Định nghĩa hàm để thêm các tháng còn thiếu
function fillMissingMonths(data) {
  // Bước 1: Sắp xếp dữ liệu theo tháng (nếu cần)
  data.sort((a, b) => dayjs(a.month, 'MM-YYYY').diff(dayjs(b.month, 'MM-YYYY')))

  // Bước 2: Xác định tháng nhỏ nhất và lớn nhất
  const minMonth = dayjs(data[0].month, 'MM-YYYY')
  const maxMonth = dayjs(data[data.length - 1].month, 'MM-YYYY')

  // Bước 3: Tạo danh sách tất cả các tháng giữa tháng nhỏ nhất và lớn nhất
  let allMonths = []
  let currentMonth = minMonth

  while (currentMonth.isBefore(maxMonth) || currentMonth.isSame(maxMonth)) {
    allMonths.push(currentMonth.format('MM-YYYY'))
    currentMonth = currentMonth.add(1, 'month')
  }

  // Bước 4: Thêm vào array những tháng còn thiếu với countUser là 0
  let completeData = allMonths.map((month) => {
    let existingMonth = data.find((item) => item.month === month)
    return existingMonth ? existingMonth : { countUser: 0, month: month }
  })

  return completeData
}

const getAvailableMonths = (time) => {
  const months = []
  const createdAt = dayjs(time) // Giả sử user.createdAt là ngày người dùng đăng ký
  const currentMonth = dayjs()

  // Lấy năm và tháng từ createdAt và currentMonth
  let month = createdAt.month()
  let year = createdAt.year()

  // Tính toán từ tháng đăng ký đến tháng hiện tại
  while (
    year < currentMonth.year() ||
    (year === currentMonth.year() && month <= currentMonth.month())
  ) {
    // Định dạng giá trị MM-YYYY
    months.push(dayjs().year(year).month(month).format('MM-YYYY'))

    // Tiến tới tháng tiếp theo
    month++
    if (month === 12) {
      month = 0 // Reset về tháng 0 (tháng 1)
      year++ // Tăng năm
    }
  }

  return months
}

const statisticUtil = {
  fillMissingMonths,
  getAvailableMonths
}
export default statisticUtil
