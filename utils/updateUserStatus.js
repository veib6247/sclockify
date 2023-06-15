import { WebClient } from '@slack/web-api'

/**
 *
 * @param {string} callbackId
 * @returns lets youknow if the status was updated
 */
export const updateUserStatus = async (callbackId) => {
  const slackUser = new WebClient(process.env.SLACK_USER_TOKEN)

  let statusText = ''
  let statusEmoji = ''

  switch (callbackId) {
    case 'clock_in':
      statusText = ''
      statusEmoji = ''
      break

    case 'clock_out':
      statusText = 'Clocked out'
      statusEmoji = ':zzz:'
      break

    case 'break_15':
      statusText = '15 minutes break'
      statusEmoji = ':clock1:'
      break

    case 'break_30':
      statusText = '30 minutes break'
      statusEmoji = ':clock1:'
      break

    case 'lunch':
      statusText = 'Lunch Break'
      statusEmoji = ':meat_on_bone:'
      break

    case 'extended_break':
      statusText = 'Extended Break'
      statusEmoji = ':hourglass:'
      break

    default:
      statusText = ''
      statusEmoji = ''
      break
  }

  try {
    const result = await slackUser.users.profile.set({
      profile: {
        status_text: statusText,
        status_emoji: statusEmoji,
      },
    })

    if (result.ok) console.log('User status updated.')

    //
  } catch (error) {
    console.error(error)
  }
}
