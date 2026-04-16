import { createBrowserRouter } from "react-router";
import { DocumentView } from "./pages/DocumentView";
import { NewNotePage } from "./pages/NewNotePage";
import { SearchPage } from "./pages/SearchPage";
import { RootLayout } from "./layouts/RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: DocumentView,
      },
      {
        path: "new-note",
        Component: NewNotePage,
      },
      {
        path: "search",
        Component: SearchPage,
      },
    ],
  },
]);