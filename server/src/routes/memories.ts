import { FastifyInstance, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from 'zod'

export async function memoriesRoutes(app: FastifyInstance) {
  // curl -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUmVuYXRvIExhIExhaW5hIiwiYXZhdGFyVXJsIjoiaHR0cHM6Ly9hdmF0YXJzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzM4Njc0NzA1P3Y9NCIsInN1YiI6IjQ4NzZkMzQ3LWZjOTItNDYwYi1hN2M3LWYxMmNjYTc4N2JiNCIsImlhdCI6MTY4NDQyMjY2NCwiZXhwIjoxNjg1MjAwMjY0fQ.KFqANAEkzu8H2imdVEpxwujJAzkr_3OOXS6f8GTtlHA" --request GET --data "{\"code\":\"ed37e38b081d73d0641a\"}" http://localhost:3333/memories
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })

  app.get('/memories', async (request) => {

    const memories = await prisma.memory.findMany({
      where: {
        userId: request.user.sub
      },
      orderBy: {
        createdAt: 'asc'
      }
    })
    return memories.map(({id, content, coverUrl, createdAt}) => {
      return {
        id,
        coverUrl,
        excerpt: content.substring(0, 115).concat("..."),
        createdAt
      }
    })
  })
  
  app.get('/memories/:id', async (request, reply) => {
    
    const paramsSchema = z.object({
      id: z.string().uuid()
    })
    
    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id
      }
    })

    if (!memory.isPublic && memory.userId !==  request.user.sub) {
      return reply.status(401).send()
    }

    return memory

  })

  app.post('/memories', async (request: FastifyRequest<{ Body: string }>) => {

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false)
    })
    
    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

    const memory = await prisma.memory.create({
      data: { userId: request.user.sub, content, coverUrl, isPublic }
    })

    return memory

    // curl --header "Content-Type: application/json" --request POST  --data "{\"content\":\"teste\",\"coverUrl\":\"https://github.com/xinxilas.png\",\"isPublic\":1}" http://localhost:3333/memories
    
  })

  app.put('/memories/:id', async (request: FastifyRequest<{ Body: string }>, reply) => {
    
    const paramsSchema = z.object({
      id: z.string().uuid()
    })
    
    const { id } = paramsSchema.parse(request.params)
    
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false)
    })
    
    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

    let memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id
      }
    })

    if (memory.userId !== request.user.sub) {
      return reply.status(401).send()
    }
    
    memory = await prisma.memory.update({
      where: {
        id
      },
      data: { content, coverUrl, isPublic }
    })
    // curl --header "Content-Type: application/json" --request PUT --data "{\"content\":\"Oi!!\",\"coverUrl\":\"https://github.com/xinxilas.png\",\"isPublic\":1}" http://localhost:3333/memories/bacb5938-81e8-4473-ace8-898d883fd179
    
    return memory
    
  })

  app.delete('/memories/:id', async (request,reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })
    
    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id
      }
    })

    if (memory.userId !== request.user.sub) {
      return reply.status(401).send()
    }

    await prisma.memory.delete({
      where: {
        id
      }
    })

    // curl --header "Content-Type: application/json" --request DELETE http://localhost:3333/memories/bacb5938-81e8-4473-ace8-898d883fd179

  })
}