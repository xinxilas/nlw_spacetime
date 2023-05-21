import { FastifyInstance, FastifyRequest } from "fastify";
import { json } from "stream/consumers";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", async (request: FastifyRequest<{ Body: string }>) => {

    const bodySchema = z.object({
      code: z.string()
    })
    const { code } = bodySchema.parse(request.body)

    const accessTokenResponse = await fetch(
      "https://github.com/login/oauth/access_token?" + new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID || "",
      client_secret: process.env.GITHUB_CLIENT_SECRET || "",
      code
    }).toString(),
    {
      method: "POST",
      headers: {
        Accept: "application/json",
      }
    })
    const { access_token } = await accessTokenResponse.json()
    
    const userResponse = await fetch(
      "https://api.github.com/user",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        }
      }
    )
    const userSchema = z.object({
      id: z.number(),
      login: z.string(),
      name: z.string(),
      avatar_url: z.string().url(),
    })
    const userInfo = userSchema.parse(await userResponse.json())

    let user = await prisma.user.findUnique({
      where: {
        gitHubId: userInfo.id,
      },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
      },      
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          gitHubId: userInfo.id,
          login: userInfo.login,
          name: userInfo.name,
          avatarUrl: userInfo.avatar_url,
        }
      })
    }

    const token = app.jwt.sign({
      name: user.name,
      avatarUrl: user.avatarUrl
    }, { 
      sub: user.id,
      expiresIn: '9 days'
    })

    return { token }
    // curl --header "Content-Type: application/json" --request POST --data "{\"code\":\"6a84bb18b922680a1b1a\"}" http://localhost:3333/register
  })
}