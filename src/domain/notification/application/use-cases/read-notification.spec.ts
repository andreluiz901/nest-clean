import { makeNotification } from 'test/factories/make-notification'
import { ReadNotificationUseCase } from './read-notifications'
import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notificatios-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryNotificationRepository: InMemoryNotificationRepository
let sut: ReadNotificationUseCase

describe('Read Notification', () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificationRepository)
  })

  it('Should be able to read a notification', async () => {
    const notification = makeNotification()

    inMemoryNotificationRepository.create(notification)

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryNotificationRepository.items[0].readAt).toEqual(
      expect.any(Date),
    )
  })

  it('Should not be able to read a notification from another user', async () => {
    const notification = makeNotification(
      { recipientId: new UniqueEntityId('recipient-1') },
      new UniqueEntityId('answer-1'),
    )

    inMemoryNotificationRepository.create(notification)

    const result = await sut.execute({
      recipientId: 'Author-2',
      notificationId: notification.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
