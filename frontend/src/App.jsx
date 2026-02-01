import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loadUser } from "./redux/slices/authSlice";
import Root from "./layouts/Root";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import FolderPage from "./pages/FolderPage";
import { Toaster } from "sonner";

function App() {
  const theme = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

    useEffect(() => {
      if (localStorage.getItem("token")) {
        dispatch(loadUser());
      }
    }, [dispatch]);

  return (
    <>
      <Routes>
        {/* Layout Route */}
        <Route element={<Root />}>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />

          <Route path="/folder/:folderId" element={<FolderPage />} />
        </Route>
      </Routes>

      <Toaster
        position="top-right"
        richColors={theme === "light"} // Rich colors for light mode
        toastOptions={{
          style: {
            background: theme === "dark" ? "#0a0a0a" : undefined, // dark bg in dark mode
            color: theme === "dark" ? "#f9fafb" : undefined, // light text in dark mode
            border : theme === "dark" ? "0.5px solid #27272a" : undefined, // border in dark mode
          },
        }}
      />
    </>
  );
}

export default App;
