import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import Linking from './Linking.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Linking />   
  </StrictMode>,
)