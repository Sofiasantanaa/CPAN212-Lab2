const fs = require('fs/promises')
const path = require('path')

const LOG = path.join(__dirname, '../data/logs/audit.log')

exports.log = async message => {
  const entry = `[${new Date().toISOString()}] ${message}\n`
  await fs.appendFile(LOG, entry)
}
