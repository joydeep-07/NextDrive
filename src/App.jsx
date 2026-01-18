import { useEffect } from "react";
import { useSelector } from "react-redux";
import Root from "./layouts/Root";
import Hero from "./components/Hero";
import Footer from "./layouts/Footer";

function App() {
  const theme = useSelector((state) => state.theme.mode);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <>
      <Root />
      <Hero/>
      <Footer/>
    </>
  );
}

export default App;
