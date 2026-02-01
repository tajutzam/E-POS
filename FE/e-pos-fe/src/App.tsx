import { Routes, Route } from "react-router"
import { DashboardLayout } from "./components/layouts/DashboardLayout"

import DashboardPage from "./pages/DashboardPage"
import UserPage from "./pages/admin/data/UserPage"
import CategoryPage from "./pages/admin/data/categories/CategoryPage"
import ProductPage from "./pages/admin/data/products/ProductPage"
import CashierPage from "./pages/transactions/CashierPage"
import HistoryTransactionPage from "./pages/transactions/HistoryTransactionPage"
import Login from "./pages/auth/Login"
import { Toaster } from "react-hot-toast"
import PrivateRoute from "./components/layouts/PrivateRoute"
import { AuthProvider } from "./contexts/AuthContext"
import Register from "./pages/auth/Register"
import CategoryCreatePage from "./pages/admin/data/categories/CategoryCreatePage"
import CategoryEditPage from "./pages/admin/data/categories/CategoryEditPage"
import ProductCreatePage from "./pages/admin/data/products/ProductCreatePage"
import ProductUpdatePage from "./pages/admin/data/products/ProductEditPage"

function App() {
  return (

    <AuthProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />

            <Route path="/data">
              <Route path="users" element={<UserPage />} />
              <Route path="categories" element={<CategoryPage />} />
              <Route path="categories/create" element={<CategoryCreatePage />} />
              <Route path="categories/edit/:uuid" element={<CategoryEditPage />} />

              <Route path="products" element={<ProductPage />} />
              <Route path="products/create" element={<ProductCreatePage />} />
              <Route path="products/edit/:uuid" element={<ProductUpdatePage />} />

            </Route>

            <Route path="cashier" element={<CashierPage />} />
            <Route path="history" element={<HistoryTransactionPage />} />

            <Route path="/settings" element={<div>Settings Page</div>} />
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Routes>
    </AuthProvider>


  )
}

export default App