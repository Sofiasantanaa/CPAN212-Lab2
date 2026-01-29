const http = require('http')
const fs = require('fs/promises')
const path = require('path')
const documentRoutes = require('./routes/documentRoutes')

const PORT = 3000

const server = http.createServer(async (req, res) => {
  try {
    if (req.url.startsWith('/api')) {
      return documentRoutes(req, res)
    }

    const filePath = path.join(
      __dirname,
      '../public',
      req.url === '/' ? 'index.html' : req.url
    )

    const data = await fs.readFile(filePath)
    res.writeHead(200)
    res.end(data)
  } catch {
    res.writeHead(404)
    res.end('Not Found')
  }
})

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
