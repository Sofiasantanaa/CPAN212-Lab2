const form = document.getElementById('docForm')
const table = document.getElementById('docs')

const loadDocs = async () => {
  const res = await fetch('/api/documents')
  const docs = await res.json()

  table.innerHTML = `
    <tr>
      <th>ID</th>
      <th>Client</th>
      <th>Type</th>
      <th>Status</th>
    </tr>
  `

  docs.forEach(({ id, clientRef, docType, status }) => {
    table.innerHTML += `
      <tr>
        <td>${id}</td>
        <td>${clientRef}</td>
        <td>${docType}</td>
        <td>${status}</td>
      </tr>
    `
  })
}

form.addEventListener('submit', async e => {
  e.preventDefault()

  const body = {
    clientRef: clientRef.value,
    docType: docType.value,
    fileName: fileName.value,
    content: content.value
  }

  await fetch('/api/documents', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(body)
})


  form.reset()
  loadDocs()
})

loadDocs()

