const fs = require('fs/promises')
const path = require('path')

const DB = path.join(__dirname, '../data/documents.json')

const readDB = async () => {
  const data = await fs.readFile(DB, 'utf-8')
  return JSON.parse(data || '[]')
}

const writeDB = async data => {
  await fs.writeFile(DB, JSON.stringify(data, null, 2))
}

exports.getAll = async () => readDB()

exports.getOne = async id => {
  const docs = await readDB()
  return docs.find(d => d.id === id)
}

exports.save = async doc => {
  const docs = await readDB()
  docs.push(doc)
  await writeDB(docs)
}

exports.update = async (id, updated) => {
  const docs = await readDB()
  const index = docs.findIndex(d => d.id === id)
  docs[index] = updated
  await writeDB(docs)
}
