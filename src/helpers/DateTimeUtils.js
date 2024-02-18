import moment from 'moment'

const formatDate = (dateString) => {
  let date = moment(dateString)
  return date.format("ddd, Do MMM [']YY")
}

const formatTime = (dateString) => {
  let date = moment(dateString)
  return date.format("hh[:]mm a")
}

const formatDateTime = (dateString) => {
  let date = moment(dateString)
  return date.format("D MMM [']YY [@] HH[:]mm")
}

const getHourDiff = (a, b) => {
  let start = moment(a)
  let end = moment(b)
  return Math.floor(moment.duration(end.diff(start)).asHours())
}

const getMinuteDiff = (a, b) => {
  let start = moment(a)
  let end = moment(b)
  return Math.floor(moment.duration(end.diff(start)).asMinutes() % 60)
}

export { formatDate, formatTime, formatDateTime, getHourDiff, getMinuteDiff }