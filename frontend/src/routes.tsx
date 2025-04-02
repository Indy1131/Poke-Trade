import Home from "./pages/Home";
import Error from "./pages/Error";
import Layout from "./pages/Layout";
import Login from "./pages/Login";

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
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
];
