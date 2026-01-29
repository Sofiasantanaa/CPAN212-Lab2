const fs = require('fs/promises')
const path = require('path')
const { randomUUID } = require('crypto')

const repo = require('../repositories/documentRepository')
const logger = require('../utils/auditLogger')

const CONTENT_DIR = path.join(__dirname, '../data/content')

const VALID_TRANSITIONS = {
  RECEIVED: ['VALIDATED', 'REJECTED'],
  VALIDATED: ['QUEUED', 'REJECTED'],
  QUEUED: ['PROCESSED', 'REJECTED'],
  PROCESSED: [],
  REJECTED: []
}

// ---------- CREATE DOCUMENT ----------
exports.create = async data => {
  const id = randomUUID()
  await fs.mkdir(CONTENT_DIR, { recursive: true })

  const contentPath = path.join(CONTENT_DIR, `${id}.txt`)
  await fs.writeFile(contentPath, data.content ?? '')

  const document = {
    id,
    clientRef: data.clientRef,
    docType: data.docType,
    fileName: data.fileName,
    contentPath,
    status: 'RECEIVED',
    createdAt: new Date().toISOString()
  }

  await repo.save(document)
  await logger.log(`Document created: ${id}`)

  return document
}

// ---------- READ ----------
exports.getAll = async () => repo.getAll()

exports.getOne = async id => repo.getOne(id)

// ---------- READ CONTENT ----------
exports.getContent = async id => {
  const doc = await repo.getOne(id)
  return fs.readFile(doc.contentPath, 'utf-8')
}

// ---------- UPDATE ----------
exports.update = async (id, updates) => {
  const doc = await repo.getOne(id)
  if (doc.status === 'PROCESSED') {
    throw new Error('Processed documents cannot be modified')
  }

  const updated = { ...doc, ...updates }
  await repo.update(id, updated)
  await logger.log(`Document updated: ${id}`)
  return updated
}

// ---------- UPDATE STATUS ----------
exports.updateStatus = async (id, newStatus) => {
  const doc = await repo.getOne(id)

  if (!VALID_TRANSITIONS[doc.status].includes(newStatus)) {
    throw new Error(`Invalid transition from ${doc.status} to ${newStatus}`)
  }

  doc.status = newStatus
  await repo.update(id, doc)
  await logger.log(`Status updated: ${id} → ${newStatus}`)
  return doc
}

// ---------- DELETE (LOGICAL) ----------
exports.remove = async (id, reason) => {
  const doc = await repo.getOne(id)
  doc.status = 'REJECTED'
  doc.rejectionReason = reason ?? 'No reason provided'
  await repo.update(id, doc)
  await logger.log(`Document rejected: ${id}`)
  return doc
}

// ---------- DAILY EXPORT ----------
exports.dailyExport = async () => {
  await new Promise(resolve => setTimeout(resolve, 3000)) // async delay

  const docs = await repo.getAll()
  const exportFile = path.join(
    __dirname,
    `../data/export-${Date.now()}.json`
  )

  await fs.writeFile(exportFile, JSON.stringify(docs, null, 2))
  await logger.log('Daily export generated')

  return { file: path.basename(exportFile), count: docs.length }
}



