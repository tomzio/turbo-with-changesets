export function formatDate(date: Date, format = 'yyyy-MM-dd hh:mm:ss'): string {
  let dateString = format
  const dateOption = {
    'Y+': date.getFullYear().toString(),
    'y+': date.getFullYear().toString(),
    'M+': (date.getMonth() + 1).toString(),
    'D+': date.getDate().toString(),
    'd+': date.getDate().toString(),
    'h+': date.getHours() % 12 == 0 ? '12' : (date.getHours() % 12).toString(),
    'H+': date.getHours().toString(),
    'm+': date.getMinutes().toString(),
    's+': date.getSeconds().toString(),
    'q+': Math.floor((date.getMonth() + 3) / 3).toString(),
    S: date.getMilliseconds().toString(),
  }

  for (const k in dateOption) {
    const reg = new RegExp('(' + k + ')').exec(format)
    const key = <keyof typeof dateOption>k
    if (reg) {
      dateString = dateString.replace(
        reg[1],
        reg[1].length === 1 ? dateOption[key] : dateOption[key].padStart(reg[1].length, '0')
      )
    }
  }
  return dateString
}

console.log(formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'))
