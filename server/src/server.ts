import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import { resolve } from 'node:path'

import { memoriesRoutes } from './routes/memories'

import "dotenv/config"
import { authRoutes } from './routes/auth'
import { uploadRoutes } from './routes/upload'

const app = fastify()

app.register(require('@fastify/static'), {
  root: resolve(__dirname, "../uploads"),
  prefix: '/uploads'
})

app.register(multipart)
app.register(jwt, {
  secret: '*@jdqx d2Jh!_ s',
})
app.register(cors, {
  origin: true,
})

app.register(memoriesRoutes)
app.register(authRoutes)
app.register(uploadRoutes)


app
  .listen({
    port: 3333,
    host: '0.0.0.0'
  })
  .then(() => {
    console.log('HTTP server running: http://0.0.0.0:3333')
  })