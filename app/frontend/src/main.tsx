import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import router from "./router.tsx";
import {RouterProvider} from "react-router";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {Toaster} from "sonner";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster/>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}/>
      <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>
  </StrictMode>
);
