import { createBrowserRouter } from "react-router";
import Root from "./Root";
import Home from "./pages/Home";
import Records from "./pages/Records";
import Consult from "./pages/Consult";
import Profile from "./pages/Profile";
import AIConsult from "./pages/AIConsult";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "records", Component: Records },
      { path: "consult", Component: Consult },
      { path: "profile", Component: Profile },
    ],
  },
  {
    path: "/ai-consult",
    Component: AIConsult
  }
]);
