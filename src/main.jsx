import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles/main.scss'

function App() {
  return (
    <main className="container">
      <p className="container__eyebrow">React + Vite · PHP + MySQL</p>
      <h1 className="container__title">Projeto pronto para começar</h1>
      <p className="container__description">Frontend moderno para desenvolvimento local, com backend PHP preparado para hospedagem compartilhada.</p>
      <p className="container__hint">Execute <code className="code">npm run dev</code> para iniciar o Vite.</p>
    </main>
  )
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>,
)
