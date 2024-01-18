import { Module } from '@nestjs/common'

import { JwtEncrypter } from './jwt-encrypter'
import { bcryptHasher } from './bcrypt-hasher'

import { Encrypter } from '@/domain/forum/application/cryptography/encrypter'
import { HasheComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HasheComparer, useClass: bcryptHasher },
    { provide: HashGenerator, useClass: bcryptHasher },
  ],
  exports: [Encrypter, HasheComparer, HashGenerator],
})
export class CryptoGraphyModule {}
