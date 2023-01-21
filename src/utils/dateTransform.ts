export const getCreatedTimeToNow = (createAt: string) => {
  const timestamp = new Date(createAt).getTime()
  const dt = Date.now() - timestamp
  const hours = Math.floor(dt / 1000 / 60 / 60)
  if (hours >= 0 && hours < 24) {
    return (hours > 0 ? hours : 1) + '小时前'
  } else if (hours >= 24 && hours < 24 * 30) {
    return Math.floor(hours / 24) + '天前'
  } else if (hours >= 24 * 30 && hours < 24 * 30 * 12) {
    return Math.floor(hours / 24 / 30) + '月前'
  } else {
    return Math.floor(hours / 24 / 30 / 12) + '年前'
  }
}
