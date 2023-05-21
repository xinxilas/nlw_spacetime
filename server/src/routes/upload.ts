import { FastifyInstance, FastifyRequest } from "fastify";
import { randomUUID } from 'node:crypto'
import { resolve } from 'node:path'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'
import { createWriteStream } from "node:fs";
import { extname } from "node:path";

const pump = promisify(pipeline)

export async function uploadRoutes(app: FastifyInstance) {

  app.post("/upload", async (request, reply) => {

    await request.jwtVerify()

    const upload = await request.file({
      limits: {
        fileSize: 5_242_880 // 5mb
      }
    })
    
    if (!upload) {
      return reply.status(400).send()
    }

    const mimeTypeRegex = /^(image|video)\/[a-zA-Z]+/
    const isValiFileFormat = mimeTypeRegex.test(upload.mimetype)
    
    if (!isValiFileFormat) {
      return reply.status(400).send()
    }

    const fileId = randomUUID()
    const extension = extname(upload.filename)
    const fileName = fileId.concat(extension)

    const writeStream = createWriteStream(
      resolve(__dirname, '../../uploads/', fileName)
    )
    await pump(upload.file, writeStream)

    const fullUrl = request.protocol.concat('://').concat(request.hostname)
    const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString()

    return { fileUrl }

    // curl -v -F 'upload=@\"upload_test.jpg\"' localhost:3333/upload
  })
}