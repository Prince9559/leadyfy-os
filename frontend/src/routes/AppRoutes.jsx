import { BrowserRouter, Routes, Route } from "react-router-dom";
import ClientList from "../pages/Clients/ClientList";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import AddClient from "../pages/Clients/AddClient";
import ClientProfile from "../pages/Clients/ClientProfile";
import ClientView from "../pages/Clients/ClientView";
import OrderList from "../pages/Orders/OrderList";
import AddOrder from "../pages/Orders/AddOrder";
import OrderView from "../pages/Orders/OrderView";
import OrderProfile from "../pages/Orders/OrderProfile";
import ScriptList from "../pages/Scripts/ScriptList";
import AddScript from "../pages/Scripts/AddScript";
import ScriptDetails from "../pages/Scripts/ScriptDetails";
import ScriptProfile from "../pages/Scripts/ScriptProfile";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
  path="/clients"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <ClientList />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/clients/view/:id"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <ClientView />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/clients/:id"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <ClientProfile />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/clients/add"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <AddClient />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/orders"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <OrderList />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/orders/add"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <AddOrder />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/orders/view/:id"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <OrderView />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/orders/:id"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <OrderProfile />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/scripts"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <ScriptList />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/scripts/add"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <AddScript />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/scripts/view/:id"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <ScriptDetails />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/scripts/:id"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <ScriptProfile />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

   </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;