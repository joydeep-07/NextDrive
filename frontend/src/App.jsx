import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loadUser } from "./redux/slices/authSlice";
import Root from "./layouts/Root";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import FolderPage from "./pages/FolderPage";

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
    <Routes>
      {/* Layout Route */}
      <Route element={<Root />}>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />

        <Route path="/folder/:folderId" element={<FolderPage />} />
      </Route>
    </Routes>
  );
}

export default App;
