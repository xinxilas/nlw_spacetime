import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from 'zod'
import { request } from "http";

export async function memoriesRoutes(app: FastifyInstance) {
  app.get('/memories', async () => {
    const memories = await prisma.memory.findMany({
      orderBy: {
        createdAt: 'asc'
      }
    })
    return memories.map(({id, content, coverUrl}) => {
      return {
        id,
        coverUrl,
        excerpt: content.substring(0, 115).concat("...")
      }
    })
  })
  app.get('/memories/:id', async (request) => {
    
    const paramsSchema = z.object({
      id: z.string().uuid()
    })
    
    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id
      }
    })

    return memory

  })
  app.post('/memories', async (request) => {
    
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false)
    })
    
    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

    const memory = await prisma.memory.create({
      data: { userId: "bd6f6f36-38d0-4972-a79f-dca50515bffe", content, coverUrl, isPublic }
    })

    return memory

    // curl --header "Content-Type: application/json" --request POST  --data "{\"content\":\"teste\",\"coverUrl\":\"https://github.com/xinxilas.png\",\"isPublic\":1}" http://localhost:3333/memories
    
  })
  app.put('/memories/:id', async (request) => {
    
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
    
    const memory = await prisma.memory.update({
      where: {
        id
      },
      data: { content, coverUrl, isPublic }
    })
    // curl --header "Content-Type: application/json" --request PUT --data "{\"content\":\"Oi!!\",\"coverUrl\":\"https://github.com/xinxilas.png\",\"isPublic\":1}" http://localhost:3333/memories/bacb5938-81e8-4473-ace8-898d883fd179
    
    return memory
    
  })
  app.delete('/memories/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })
    
    const { id } = paramsSchema.parse(request.params)

    await prisma.memory.delete({
      where: {
        id
      }
    })

    // curl --header "Content-Type: application/json" --request DELETE http://localhost:3333/memories/bacb5938-81e8-4473-ace8-898d883fd179

  })
}