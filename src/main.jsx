// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )




// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import { BrowserRouter } from 'react-router-dom'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </StrictMode>,
// )





// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import { BrowserRouter } from 'react-router-dom'
// import { TransactionProvider } from './context/TransactionContext'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <BrowserRouter>
//       <TransactionProvider>
//         <App />
//       </TransactionProvider>
//     </BrowserRouter>
//   </StrictMode>,
// )







// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import { BrowserRouter } from 'react-router-dom'
// import { TransactionProvider } from './context/TransactionContext'
// import { SettingsProvider } from './context/SettingsContext'
// import { AuthProvider } from './context/AuthContext'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <BrowserRouter>
//       {/* Multiple providers nested here is normal — each one manages a
//           completely separate slice of application state (transactions
//           vs. settings vs. authentication). TransactionProvider and
//           SettingsProvider must be nested INSIDE AuthProvider, since
//           both call useAuth() internally to read the current token. */}
//       <AuthProvider>
//         <TransactionProvider>
//           <SettingsProvider>
//             <App />
//           </SettingsProvider>
//         </TransactionProvider>
//       </AuthProvider>
//     </BrowserRouter>
//   </StrictMode>,
// )





import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { TransactionProvider } from './context/TransactionContext'
import { SettingsProvider } from './context/SettingsContext'
import { AuthProvider } from './context/AuthContext'
import { BudgetProvider } from './context/BudgetContext'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TransactionProvider>
          <BudgetProvider>
            <SettingsProvider>
              {/* ThemeProvider must be INSIDE SettingsProvider — it calls
                  useSettings() to read the persisted theme preference.
                  It wraps <App /> so the resolved theme applies to every
                  route, including /login and /register, which sit
                  outside ProtectedRoute but still need theme support. */}
              <ThemeProvider>
                <App />
              </ThemeProvider>
            </SettingsProvider>
          </BudgetProvider>
        </TransactionProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)