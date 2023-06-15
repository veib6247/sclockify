import Fastify from 'fastify'
import * as dotenv from 'dotenv'
import * as formbody from '@fastify/formbody'

// local utils
import { evalCallback } from './utils/evalCallback.js'
import { createTimestamp } from './utils/createTimestamp.js'
import { fetchSlackUser } from './utils/fetchSlackUser.js'
import { submitMsg } from './utils/submitMsg.js'
import { updateUserStatus } from './utils/updateUserStatus.js'

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

  const userId = payloadFromSlack.user.id
  const callbackId = payloadFromSlack.callback_id
  const timeStamp = createTimestamp()
  const slackUser = await fetchSlackUser(userId)

  if (slackUser) {
    const submitToSlack = await submitMsg(
      slackUser,
      evalCallback(callbackId),
      timeStamp
    )

    if (submitToSlack) {
      await updateUserStatus(callbackId)
    }
  }

  //
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
