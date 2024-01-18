import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'

const authenthicateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenthicateBodySchema = z.infer<typeof authenthicateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(private authenticateStudent: AuthenticateStudentUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenthicateBodySchema))
  async handle(@Body() body: AuthenthicateBodySchema) {
    const { email, password } = body

    const result = await this.authenticateStudent.execute({
      email,
      password,
    })

    if (result.isLeft()) throw new Error()

    const { accessToken } = result.value

    return { access_token: accessToken }
  }
}
