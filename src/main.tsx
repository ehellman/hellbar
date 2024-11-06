import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Bar from './Bar.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Bar />
  </StrictMode>,
)
