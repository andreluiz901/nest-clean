import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentRepository: InMemoryStudentRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch question comments', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository()
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentRepository,
    )
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  it('Should be able to fetch  comment questions', async () => {
    const student = makeStudent({ name: 'Valid Name' })

    inMemoryStudentRepository.items.push(student)

    const comment1 = await makeQuestionComment({
      questionId: new UniqueEntityId('question-1'),
      authorId: student.id,
    })
    const comment2 = await makeQuestionComment({
      questionId: new UniqueEntityId('question-1'),
      authorId: student.id,
    })
    const comment3 = await makeQuestionComment({
      questionId: new UniqueEntityId('question-1'),
      authorId: student.id,
    })

    await inMemoryQuestionCommentsRepository.create(comment1)
    await inMemoryQuestionCommentsRepository.create(comment2)
    await inMemoryQuestionCommentsRepository.create(comment3)

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(result.value?.comments).toHaveLength(3)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'Valid Name',
          commentId: comment1.id,
        }),
        expect.objectContaining({
          author: 'Valid Name',
          commentId: comment2.id,
        }),
        expect.objectContaining({
          author: 'Valid Name',
          commentId: comment3.id,
        }),
      ]),
    )
  })

  it('Should be able to fetch questions comments paginated', async () => {
    const student = makeStudent({ name: 'Valid Name' })

    inMemoryStudentRepository.items.push(student)

    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityId('question-1'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.value?.comments).toHaveLength(2)
  })
})
