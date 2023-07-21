import { AppLayout } from "layouts/app";
import { RootLayout } from "layouts/root";
import { Friend } from "pages/friend";
import { Home } from "pages/home";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "sign-in",
        lazy: () => import("pages/sign-in"),
      },
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: "search",
            lazy: () => import("pages/search"),
          },
          {
            path: "friend",
            element: <Friend />,
          },
          {
            path: "*",
            lazy: () => import("pages/404"),
          },
        ],
      },
    ],
  },
]);

export function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer autoClose={3000} theme="colored" />
    </>
  );
}
