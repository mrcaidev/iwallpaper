import { AppLayout } from "layouts/app";
import { RootLayout } from "layouts/root";
import { Friend } from "pages/friend";
import { Home } from "pages/home";
import { NotFound } from "pages/not-found";
import { Search } from "pages/search";
import { SignIn } from "pages/sign-in";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "sign-in",
        element: <SignIn />,
      },
      {
        path: "/",
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: "search",
            element: <Search />,
          },
          {
            path: "friend",
            element: <Friend />,
          },
          {
            path: "*",
            element: <NotFound />,
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
