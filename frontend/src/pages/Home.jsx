import React from "react";
import { useSelector } from "react-redux";
import Hero from "../components/Hero";
import Dashboard from "../ui/Dashboard";

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return <div>{isAuthenticated ? <Dashboard /> : <Hero />}</div>;
};

export default Home;
