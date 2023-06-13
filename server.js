// Require the framework and instantiate it
import Fastify from 'fastify'
import * as dotenv from 'dotenv'
import { WebClient } from '@slack/web-api'

//
dotenv.config()

const fastify = Fastify({
  logger: true,
})

// Declare a route
fastify.post('/', async (request, reply) => {
  console.log(request.body)
})

// Run the server!
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
