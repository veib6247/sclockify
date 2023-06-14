// Require the framework and instantiate it
import Fastify from 'fastify'
import * as dotenv from 'dotenv'
import * as formbody from '@fastify/formbody'
import { WebClient } from '@slack/web-api'

//
dotenv.config()

const fastify = Fastify({
  logger: true,
})

// parse application/x-www-form-urlencoded
fastify.register(formbody)

/**
 * Declare a route
 */
fastify.post('/', async (request, reply) => {
  // parse form to JSON
  const payloadFromSlack = JSON.parse(decodeURIComponent(request.body.payload))
  console.log(`Fetching data from user ${payloadFromSlack.user.id}`)

  const callbackId = payloadFromSlack.callback_id

  // calc time
  const today = new Date()
  const timeStamp = `${appendZero(today.getHours())}:${appendZero(
    today.getMinutes()
  )}:${appendZero(today.getSeconds())}`

  // Initialize slack bot
  const slack = new WebClient(process.env.SLACK_BOT_TOKEN)
  let slackUser = ''

  // fetch data of the user that used the shortcut
  try {
    const result = await slack.users.profile.get({
      user: payloadFromSlack.user.id,
    })

    console.log({
      userName: result.profile.real_name,
      callback: callbackId,
      timeStamp: timeStamp,
    })
    slackUser = result.profile.real_name

    //
  } catch (error) {
    console.error(error)
  }

  // actually submit a msg to the channel
  try {
    let commandContext = ''

    // eval action
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

    const result = await slack.chat.postMessage({
      channel: process.env.SLACK_CHANNEL_ID,
      text: `${slackUser} has ${commandContext} - @${timeStamp}`,
    })

    if (result.ok) {
      console.log(`${slackUser} has ${commandContext}`)
    }

    //
  } catch (error) {
    console.error(error)
  }

  reply.send({
    slackUser: slackUser,
    callbackId: callbackId,
    timeStamp: timeStamp,
  })
})

/**
 * helper function to format time
 * @param {number} time
 * @returns formatted time
 */
const appendZero = (time) => {
  return time < 10 ? `0${time}` : time
}

/**
 * Run the server!
 */
const start = async () => {
  try {
    // run on local mode
    if (process.env.SERVER_MODE === 'TEST') {
      console.log('Server running in DEV mode')
      await fastify.listen({ port: 3000 })
    } else {
      console.log('Server running in PROD mode')
      // use port provided by railway when hosted
      fastify.listen({
        host: '0.0.0.0',
        port: process.env.PORT,
      })
    }
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
