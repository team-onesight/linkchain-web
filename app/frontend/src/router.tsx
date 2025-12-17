import {type JSX, lazy, Suspense, useEffect} from "react";
import {createBrowserRouter} from "react-router-dom";

interface LazyComponentProps {
  RenderElement: React.LazyExoticComponent<() => JSX.Element>;
}

const LazyComponent: React.FC<LazyComponentProps> = ({RenderElement}) => {
  useEffect(() => {
    document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <Suspense fallback={<div></div>}>
      <RenderElement/>
    </Suspense>
  );
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LazyComponent RenderElement={lazy(() => import("@pages/LoginPage.tsx"))}/>,
  },
  {
    path: "/join",
    element: <LazyComponent RenderElement={lazy(() => import("@pages/JoinPage.tsx"))}/>,
  },
  {
    path: "/",
    element: <LazyComponent RenderElement={lazy(() => import("./App.tsx"))}/>,
    children: [
      {
        index: true,
        element: <LazyComponent RenderElement={lazy(() => import("@pages/HomePage.tsx"))}/>,
      },
      {
        path: "links",
        element: <LazyComponent RenderElement={lazy(() => import("@pages/LinkPage.tsx"))}/>,
      },
      {
        path: "links/:id",
        element: <LazyComponent RenderElement={lazy(() => import("@pages/LinkDetailPage.tsx"))}/>,
      },
      {
        path: "my",
        element: <LazyComponent RenderElement={lazy(() => import("@pages/MyPage.tsx"))}/>,
      },
      {
        path: "users/:userId/links",
        element: <LazyComponent RenderElement={lazy(() => import("@pages/UserLinksPage.tsx"))}/>,
      },
      {
        path: "search",
        element: <LazyComponent RenderElement={lazy(() => import("@pages/SearchPage.tsx"))}/>,
      },
    ],
  },
]);

export default router;
