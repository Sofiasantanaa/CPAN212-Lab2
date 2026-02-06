const service = require('../services/documentService')

const getBody = req =>
  new Promise((resolve, reject) => {
    let data = ''
    req.on('data', chunk => (data += chunk))
    req.on('end', () => {
      try {
        resolve(JSON.parse(data || '{}'))
      } catch (err) {
        reject(err)
      }
    })
  })

exports.getAll = async (req, res) => {
  const docs = await service.getAll()
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(docs))
}

exports.getOne = async (req, res, id) => {
  const doc = await service.getOne(id)
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(doc))
}

exports.create = async (req, res) => {
  const body = await getBody(req)
  const doc = await service.create(body)
  res.writeHead(201, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(doc))
}

exports.update = async (req, res, id) => {
  const body = await getBody(req)
  const doc = await service.update(id, body)
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(doc))
}

exports.updateStatus = async (req, res, id) => {
  const body = await getBody(req)
  const doc = await service.updateStatus(id, body.status)
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(doc))
}

exports.getContent = async (req, res, id) => {
  const content = await service.getContent(id)
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ content }))
}

exports.dailyExport = async (req, res) => {
  const result = await service.dailyExport()
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(result))
}

