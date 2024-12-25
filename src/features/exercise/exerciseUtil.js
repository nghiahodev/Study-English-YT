import _ from 'lodash'

const formatTime = (totalSeconds) => {
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const formattedMinutes = minutes.toFixed(0).toString().padStart(2, '0')
  const formattedSeconds = seconds.toFixed(0).toString().padStart(2, '0')

  return `${formattedMinutes}:${formattedSeconds}`
}

const calculateIntersectionPercentage = (array1, array2) => {
  const set1 = new Set(array1)
  const set2 = new Set(array2)
  const intersectionCount = _.intersection(
    Array.from(set1),
    Array.from(set2)
  ).length
  return array2.length === 0 ? 0 : (intersectionCount * 100) / array2.length
}

const exerciseUtil = {
  calculateIntersectionPercentage,
  formatTime
}
export default exerciseUtil
