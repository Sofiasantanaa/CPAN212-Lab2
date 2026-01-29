const controller = require('../controllers/documentController')

module.exports = async (req, res) => {
  const { method, url } = req

  if (method === 'GET' && url === '/api/documents') return controller.getAll(req, res)
  if (method === 'POST' && url === '/api/documents') return controller.create(req, res)

  if (url.match(/\/api\/documents\/\w+$/)) {
    const id = url.split('/')[3]
    if (method === 'GET') return controller.getOne(req, res, id)
    if (method === 'PUT') return controller.update(req, res, id)
    if (method === 'DELETE') return controller.remove(req, res, id)
  }

  if (url.match(/\/api\/documents\/\w+\/status$/)) {
    const id = url.split('/')[3]
    if (method === 'PATCH') return controller.updateStatus(req, res, id)
  }

  if (url.match(/\/api\/documents\/\w+\/content$/)) {
  const id = url.split('/')[3]
  if (method === 'GET') return controller.getContent(req, res, id)
  }

  if (method === 'GET' && url === '/api/exports/daily')
  return controller.dailyExport(req, res)

  res.writeHead(404)
  res.end(JSON.stringify({ message: 'Route not found' }))
}
