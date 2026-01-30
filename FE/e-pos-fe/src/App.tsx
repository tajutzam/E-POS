import { Routes, Route } from "react-router"
import { DashboardLayout } from "./components/layouts/DashboardLayout"

import DashboardPage from "./pages/DashboardPage"
import UserPage from "./pages/admin/data/UserPage"
import CategoryPage from "./pages/admin/data/CategoryPage"
import ProductPage from "./pages/admin/data/ProductPage"
import CashierPage from "./pages/transactions/CashierPage"
import HistoryTransactionPage from "./pages/transactions/HistoryTransactionPage"

function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/data">
          <Route path="users" element={<UserPage />} />
          <Route path="categories" element={<CategoryPage />} />
          <Route path="products" element={<ProductPage />} />
        </Route>

        <Route path="cashier" element={<CashierPage />} />
        <Route path="history" element={<HistoryTransactionPage />} />

        <Route path="/settings" element={<div>Settings Page</div>} />
      </Route>

    </Routes>
  )
}

export default App