import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

const authenthicateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenthicateBodySchema = z.infer<typeof authenthicateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenthicateBodySchema))
  async handle(@Body() body: AuthenthicateBodySchema) {
    const { email, password } = body

    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) throw new UnauthorizedException('Invalid user credentials')

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid user credentials')

    const accessToken = this.jwt.sign({ sub: user.id })

    return { access_token: accessToken }
  }
}
