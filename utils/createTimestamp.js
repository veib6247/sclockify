import moment from 'moment-timezone'

/**
 *
 * @returns time data
 */
export const createTimestamp = () => {
  const today = new Date()
  const timeStamp = moment.tz(today, 'Asia/Taipei').toLocaleString()

  console.log({
    timezoneConversion: {
      server: today.toLocaleString(),
      moment: timeStamp,
    },
  })

  return timeStamp
}
