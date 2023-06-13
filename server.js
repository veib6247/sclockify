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
fastify.get('/', async (request, reply) => {
  return { areYou: process.env.READ_THIS }
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
