import { expect, test } from 'vitest'
import { Slug } from './slug'

test('it should be able to creeate a new slug from text', () => {
  const slug = Slug.createFromText('Example text title')

  expect(slug.value).toBe('example-text-title')
})
