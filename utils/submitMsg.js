import { WebClient } from '@slack/web-api'

/**
 *
 * @param {string} slackUser
 * @param {string} commandContext
 * @param {string} timeStamp
 * @returns boolean to let you know if the msg was submitted succesfully
 */
export const submitMsg = async (slackUser, commandContext, timeStamp) => {
  const slack = new WebClient(process.env.SLACK_BOT_TOKEN)

  try {
    const result = await slack.chat.postMessage({
      channel: process.env.SLACK_CHANNEL_ID,
      text: `${slackUser} has *${commandContext}* @ ${timeStamp}`,
    })

    if (result.ok) {
      console.log(`${slackUser} has ${commandContext}`)
      return true
    }

    //
  } catch (error) {
    console.error(error)
    return false
  }
}
