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
import Pokemon from "./pages/dashboard/Pokemon";
import ForgotPassword from "./pages/ForgotPassword";
import Trades from "./pages/dashboard/Trades";
import PokemonListing from "./pages/dashboard/PokemonListing";
import CreateTrade from "./pages/dashboard/CreateTrade";
import PasswordReset from "./pages/PasswordReset";

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
        path: "/password-reset",
        element: (
          <GuestRoute>
            <PasswordReset />
          </GuestRoute>
        ),
      },
      {
        path: "/forgot-password",
        element: (
          <GuestRoute>
            <ForgotPassword />
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
            path: "/dashboard/trades",
            element: <Trades />,
          },
          {
            path: "/dashboard/transactions",
            element: <Transactions />,
          },
          {
            path: "/dashboard/pokemon/:id",
            element: <Pokemon />,
          },
          {
            path: "/dashboard/market/:id",
            element: <PokemonListing />,
          },
          {
            path: "/dashboard/create_trade/:id",
            element: <CreateTrade />,
          },
        ],
      },
    ],
  },
];
