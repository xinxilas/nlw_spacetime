import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { memoriesRoutes } from './routes/memories'

import "dotenv/config"
import { authRoutes } from './routes/auth'

const app = fastify()

app.register(memoriesRoutes)
app.register(authRoutes)
app.register(jwt, {
  secret: '*@jdqx d2Jh!_ s',
})
app.register(cors, {
  origin: true,
})

app
  .listen({
    port: 3333,
    host: '0.0.0.0'
  })
  .then(() => {
    console.log('HTTP server running: http://0.0.0.0:3333')
  })