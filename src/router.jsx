import { createBrowserRouter } from 'react-router-dom'
import RootLayout from './components/shared/RootLayout'
import DashboardLayout from './components/shared/DashboardLayout'
import PrivateRoute from './components/shared/PrivateRoute'
import RoleRoute from './components/shared/RoleRoute'

// Public pages
import Home from './pages/public/Home'
import BrowseLawyers from './pages/public/BrowseLawyers'
import LawyerDetails from './pages/public/LawyerDetails'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ChooseRole from './pages/auth/ChooseRole'
import NotFound from './pages/public/NotFound'

// Dashboard – shared
import DashboardHome from './pages/dashboard/DashboardHome'
import UpdateProfile from './pages/dashboard/shared/UpdateProfile'

// User dashboard
import UserHiringHistory from './pages/dashboard/user/UserHiringHistory'
import UserComments from './pages/dashboard/user/UserComments'

// Lawyer dashboard
import LawyerHiringHistory from './pages/dashboard/lawyer/LawyerHiringHistory'
import ManageLegalProfile from './pages/dashboard/lawyer/ManageLegalProfile'

// Admin dashboard
import ManageUsers from './pages/dashboard/admin/ManageUsers'
import AllTransactions from './pages/dashboard/admin/AllTransactions'
import Analytics from './pages/dashboard/admin/Analytics'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true,            element: <Home /> },
      { path: 'browse-lawyers', element: <BrowseLawyers /> },
      { path: 'lawyers/:id',    element: <LawyerDetails /> },
      { path: 'login',          element: <Login /> },
      { path: 'register',       element: <Register /> },
      { path: 'choose-role',    element: <PrivateRoute><ChooseRole /></PrivateRoute> },
    ],
  },
  {
    path: '/dashboard',
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      { index: true,                               element: <DashboardHome /> },
      { path: 'user/update-profile',               element: <UpdateProfile /> },

      // User routes
      { path: 'user/hiring-history',               element: <RoleRoute roles={['user']}><UserHiringHistory /></RoleRoute> },
      { path: 'user/comments',                     element: <RoleRoute roles={['user']}><UserComments /></RoleRoute> },

      // Lawyer routes
      { path: 'lawyer/hiring-history',             element: <RoleRoute roles={['lawyer']}><LawyerHiringHistory /></RoleRoute> },
      { path: 'lawyer/manage-legal-profile',       element: <RoleRoute roles={['lawyer']}><ManageLegalProfile /></RoleRoute> },

      // Admin routes
      { path: 'admin/manage-users',                element: <RoleRoute roles={['admin']}><ManageUsers /></RoleRoute> },
      { path: 'admin/all-transactions',            element: <RoleRoute roles={['admin']}><AllTransactions /></RoleRoute> },
      { path: 'admin/analytics',                   element: <RoleRoute roles={['admin']}><Analytics /></RoleRoute> },
    ],
  },
  { path: '*', element: <NotFound /> },
])

export default router
