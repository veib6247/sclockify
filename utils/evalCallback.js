/**
 *
 * @param {string} callbackId
 * @returns part of a sentence to be sent back to slack
 */
export const evalCallback = (callbackId) => {
  let commandContext = ''

  switch (callbackId) {
    case 'clock_in':
      commandContext = 'clocked in'
      break

    case 'clock_out':
      commandContext = 'clocked out'
      break

    case 'break_15':
      commandContext = 'taken a 15 minutes break'
      break

    case 'break_30':
      commandContext = 'taken a 30 minutes break'
      break

    case 'lunch':
      commandContext = 'taken a lunch break'
      break

    case 'extended_break':
      commandContext = 'taken an extended break (1hr 30mins)'
      break

    default:
      commandContext = 'broken the Space-Time Continuum'
      break
  }

  return commandContext
}
