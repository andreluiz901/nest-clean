import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Authenthicate (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    await app.init()
  })

  test('[POST] /sessions', async () => {
    await prisma.user.create({
      data: {
        name: 'valid name',
        email: 'valid_email@email.com',
        password: await hash('validPassword@123456', 8),
      },
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'valid_email@email.com',
      password: 'validPassword@123456',
    })

    expect(response.statusCode).toBe(201)

    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
