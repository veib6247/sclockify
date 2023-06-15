import { WebClient } from '@slack/web-api'

/**
 *
 * @param {string} userId
 * @returns real name of the user
 */
export const fetchSlackUser = async (userId) => {
  const slack = new WebClient(process.env.SLACK_BOT_TOKEN)

  try {
    const result = await slack.users.profile.get({
      user: userId,
    })

    if (result.ok) return result.profile.real_name

    //
  } catch (error) {
    console.error(error)
  }
}
