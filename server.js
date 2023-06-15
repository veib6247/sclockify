import Fastify from 'fastify'
import * as dotenv from 'dotenv'
import * as formbody from '@fastify/formbody'
import { WebClient } from '@slack/web-api'
import moment from 'moment-timezone'

// local utils
import { evalCallback } from './utils/evalCallback.js'

//
dotenv.config()

const fastify = Fastify({
  logger: true,
})

// parse application/x-www-form-urlencoded
fastify.register(formbody)

/**
 * Declare home route
 */
fastify.post('/', async (request, reply) => {
  const payloadFromSlack = JSON.parse(decodeURIComponent(request.body.payload))
  console.log(`Fetching data from user ${payloadFromSlack.user.id}`)

  // identifier for which shortcut was used
  const callbackId = payloadFromSlack.callback_id

  // calc time, convert to correct timezone before pushing to log
  const today = new Date()
  const timeStamp = moment.tz(today, 'Asia/Taipei').toLocaleString()

  console.log({
    timezoneConversion: {
      server: today.toLocaleString(),
      moment: timeStamp,
    },
  })

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
    let commandContext = evalCallback(callbackId)
    console.log(commandContext)

    const result = await slack.chat.postMessage({
      channel: process.env.SLACK_CHANNEL_ID,
      text: `${slackUser} has ${commandContext} @ ${timeStamp}`,
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
 * Run the server!
 */
const start = async () => {
  try {
    // run on local mode
    if (process.env.NODE_ENV === 'development') {
      await fastify.listen({ port: 3000 })
    } else {
      // use port provided by railway when hosted
      fastify.listen({
        host: '0.0.0.0',
        port: process.env.PORT,
      })
    }

    //
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)

    //
  } finally {
    console.log(`Server running in ${process.env.NODE_ENV} mode`)
  }
}

start()
