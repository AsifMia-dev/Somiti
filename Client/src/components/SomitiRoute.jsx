// SomitiRoute.jsx — auth + somiti required
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { SomitiContext } from "../context/SomitiContext";
import { Navigate } from "react-router-dom";
import Layout from "./layout/Layout";

const SomitiRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const { somiti } = useContext(SomitiContext);

  if (!user) return <Navigate to="/" replace />;
  if (!somiti) return <Navigate to="/onboarding-wizard" replace />;

  return children;
 
};

export default SomitiRoute;