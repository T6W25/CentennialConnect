import { format, formatDistanceToNow as formatDistance } from "date-fns"

export const formatDate = (date) => {
  return format(new Date(date), "PPP")
}

export const formatTime = (date) => {
  return format(new Date(date), "p")
}

export const formatDateTime = (date) => {
  return format(new Date(date), "PPp")
}

export const formatDistanceToNow = (date) => {
  return formatDistance(new Date(date), { addSuffix: true })
}

