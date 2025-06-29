const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const notes = []

  const result = listHelper.dummy(notes)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const listWithOneNote = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one note equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneNote)
    assert.strictEqual(result, 5)
  })

  const notes = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: 'Another id',
      title: 'Another title',
      author: 'Another author',
      url: 'Another url',
      likes: 3,
      __v: 0
    }
  ]

  test('when list has multiple notes equals the sum of them', () => {
    const result = listHelper.totalLikes(notes)
    assert.strictEqual(result, 8)
  })

  const emptyList = []

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(emptyList)
    assert.strictEqual(result, 0)
  })
})