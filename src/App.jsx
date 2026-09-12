// import { Routes, Route } from 'react-router-dom'
// import MainLayout from './components/layout/MainLayout'
// import ProtectedRoute from './components/auth/ProtectedRoute'
// import Login from './pages/Login'
// import Register from './pages/Register'
// import Dashboard from './pages/Dashboard'
// import Transactions from './pages/Transactions'
// import Budgets from './pages/Budgets'
// import Analytics from './pages/Analytics'
// import Settings from './pages/Settings'

// function App() {
//   return (
//     <Routes>
//       {/* Public routes — reachable without authentication */}
//       <Route path="login" element={<Login />} />
//       <Route path="register" element={<Register />} />

//       {/* Everything under MainLayout now requires authentication.
//           ProtectedRoute is the single place this is decided — none of
//           these pages check auth themselves. */}
//       <Route element={<ProtectedRoute />}>
//         <Route element={<MainLayout />}>
//           <Route index element={<Dashboard />} />
//           <Route path="transactions" element={<Transactions />} />
//           <Route path="budgets" element={<Budgets />} />
//           <Route path="analytics" element={<Analytics />} />
//           <Route path="settings" element={<Settings />} />
//         </Route>
//       </Route>
//     </Routes>
//   )
// }

// export default App









import { Routes, Route } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import GuestRoute from './components/auth/GuestRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budgets from './pages/Budgets'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'

function App() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="budgets" element={<Budgets />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App