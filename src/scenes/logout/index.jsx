import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  }, []);

  return null; // Since this component doesn't render anything, return null
};

export default Logout;