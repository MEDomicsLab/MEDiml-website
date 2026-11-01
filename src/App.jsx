import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout/Layout.jsx";
import useSmoothScroll from "./lib/useSmoothScroll.js";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  useSmoothScroll();
  useEffect(() => {
    document.documentElement.setAttribute("data-hydrated", "");
  }, []);
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
