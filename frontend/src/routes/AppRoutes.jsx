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
import CreatorList from "../pages/Creators/CreatorList";
import AddCreator from "../pages/Creators/AddCreator";
import CreatorProfile from "../pages/Creators/CreatorProfile";
import CreatorView from "../pages/Creators/CreatorView";
import ShootCalendar from "../pages/Shoots/ShootCalendar";
import AddShoot from "../pages/Shoots/AddShoot";
import ShootView from "../pages/Shoots/ShootView";
import EditShoot from "../pages/Shoots/EditShoot";
import VideoList from "../pages/Videos/VideoList";
import AddVideo from "../pages/Videos/AddVideo";
import VideoDetails from "../pages/Videos/VideoDetails";
import EditVideo from "../pages/Videos/EditVideo";
import PaymentList from "../pages/Payments/PaymentList";
import AddPayment from "../pages/Payments/AddPayment";
import PaymentView from "../pages/Payments/PaymentView";
import EditPayment from "../pages/Payments/EditPayment";
import ExpenseList from "../pages/Expenses/ExpenseList";
import AddExpense from "../pages/Expenses/AddExpense";
import ExpenseView from "../pages/Expenses/ExpenseView";
import EditExpense from "../pages/Expenses/EditExpense";
import TaskList from "../pages/Tasks/TaskList";
import AddTask from "../pages/Tasks/AddTask";
import TaskView from "../pages/Tasks/TaskView";
import EditTask from "../pages/Tasks/EditTask";
import NotificationList from "../pages/Notifications/NotificationList";
import AddNotification from "../pages/Notifications/AddNotification";
import NotificationView from "../pages/Notifications/NotificationView";
import EditNotification from "../pages/Notifications/EditNotification";
import UserList from "../pages/Users/UserList";
import AddUser from "../pages/Users/AddUser";
import EditUser from "../pages/Users/EditUser";
import RoleProtectedRoute from "./RoleProtectedRoute";

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

<Route
  path="/creators"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <CreatorList />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/creators/add"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <AddCreator />
      </AdminLayout>
    </ProtectedRoute>
  }
/>
<Route
  path="/creators/view/:id"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <CreatorView />
      </AdminLayout>
    </ProtectedRoute>
  }
/>
<Route
  path="/creators/:id"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <CreatorProfile />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/shoots"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <ShootCalendar />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/shoots/add"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <AddShoot />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/shoots/view/:id"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <ShootView />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/shoots/:id"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <EditShoot />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/videos"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <VideoList />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/videos/add"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <AddVideo />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/videos/view/:id"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <VideoDetails />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/videos/:id"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <EditVideo />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/payments"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <PaymentList />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/payments/add"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <AddPayment />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/payments/view/:id"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <PaymentView />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/payments/:id"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <EditPayment />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/expenses"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <ExpenseList />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/expenses/add"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <AddExpense />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/expenses/view/:id"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <ExpenseView />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/expenses/:id"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <EditExpense />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/tasks"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <TaskList />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/tasks/add"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <AddTask />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/tasks/view/:id"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <TaskView />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/tasks/:id"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <EditTask />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/notifications"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <NotificationList />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/notifications/add"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <AddNotification />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/notifications/view/:id"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <NotificationView />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/users"
  element={
    <RoleProtectedRoute allowedRoles={["owner", "admin"]}>
      <AdminLayout>
        <UserList />
      </AdminLayout>
    </RoleProtectedRoute>
  }
/>

<Route
  path="/users/add"
  element={
    <RoleProtectedRoute allowedRoles={["owner", "admin"]}>
      <AdminLayout>
        <AddUser />
      </AdminLayout>
    </RoleProtectedRoute>
  }
/>
<Route
  path="/users/:id"
  element={
    <RoleProtectedRoute allowedRoles={["owner", "admin"]}>
      <AdminLayout>
        <EditUser />
      </AdminLayout>
    </RoleProtectedRoute>
  }
/>

<Route
  path="/notifications/:id"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <EditNotification />
      </AdminLayout>
    </ProtectedRoute>
  }
/>
   </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;