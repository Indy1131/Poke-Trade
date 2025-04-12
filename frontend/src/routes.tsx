import Home from "./pages/Home";
import Error from "./pages/Error";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import GuestRoute from "./components/routing/GuestRoute";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import Signup from "./pages/Signup";
import Market from "./pages/dashboard/Market";
import Transactions from "./pages/dashboard/Transactions";

export default [
  {
    path: "/",
    element: <Layout />,
    errorElement: (
      <Layout>
        <Error />
      </Layout>
    ),
    children: [
      {
        path: "/",
        element: (
          <GuestRoute>
            <Home />
          </GuestRoute>
        ),
      },
      {
        path: "/login",
        element: (
          <GuestRoute>
            <Login />
          </GuestRoute>
        ),
      },
      {
        path: "/signup",
        element: (
          <GuestRoute>
            <Signup />
          </GuestRoute>
        ),
      },
      {
        path: "/dashboard",
        element: <ProtectedRoute />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/dashboard/market",
            element: <Market />,
          },
          {
            path: "/dashboard/transactions",
            element: <Transactions />,
          },
        ],
      },
    ],
  },
];
