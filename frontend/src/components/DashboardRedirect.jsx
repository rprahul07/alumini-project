import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DashboardRedirect = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("selectedRole");
  // Token handled via HTTP-only cookies, check user data
  const user = localStorage.getItem("user");

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    switch (role) {
      case "student":
        navigate("/student/dashboard", { replace: true });
        break;
      case "faculty":
        navigate("/faculty/dashboard", { replace: true });
        break;
      case "alumni":
        navigate("/alumni/dashboard", { replace: true });
        break;
      default:
        navigate("/unauthorized", { replace: true });
    }
  }, [role, token, navigate]);

  return null;
};

export default DashboardRedirect;
