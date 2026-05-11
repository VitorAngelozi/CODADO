const nodeBaseUrl = process.env.NODE_API_URL || 'http://localhost:8080'
const goBaseUrl = process.env.GO_API_URL || 'http://localhost:8081'

const scenarios = [
  {
    label: 'health',
    method: 'GET',
    path: '/health',
  },
  {
    label: 'levels',
    method: 'GET',
    path: '/levels',
  },
  {
    label: 'questions-easy',
    method: 'GET',
    path: '/questions?level=easy',
  },
  {
    label: 'questions-invalid',
    method: 'GET',
    path: '/questions?level=invalid',
  },
  {
    label: 'submit-current',
    method: 'POST',
    path: '/submit',
    body: {
      level: 'easy',
      answers: [{ id: 'q1_easy', answer: 1 }],
    },
  },
  {
    label: 'submit-legacy',
    method: 'POST',
    path: '/submit',
    body: {
      level: 'easy',
      respostas: [{ pergunta_id: 'q1_easy', opcao: '8' }],
    },
  },
]

let hasFailure = false

for (const scenario of scenarios) {
  const [nodeResponse, goResponse] = await Promise.all([
    request(nodeBaseUrl, scenario),
    request(goBaseUrl, scenario),
  ])

  if (nodeResponse.status !== goResponse.status || JSON.stringify(nodeResponse.body) !== JSON.stringify(goResponse.body)) {
    hasFailure = true
    console.error(`Mismatch in scenario "${scenario.label}"`)
    console.error('Node:', JSON.stringify(nodeResponse, null, 2))
    console.error('Go  :', JSON.stringify(goResponse, null, 2))
  } else {
    console.log(`OK ${scenario.label}`)
  }
}

if (hasFailure) {
  process.exitCode = 1
}

async function request(baseUrl, scenario) {
  const response = await fetch(`${baseUrl}${scenario.path}`, {
    method: scenario.method,
    headers: scenario.body ? { 'Content-Type': 'application/json' } : undefined,
    body: scenario.body ? JSON.stringify(scenario.body) : undefined,
  })

  return {
    status: response.status,
    body: await response.json(),
  }
}
