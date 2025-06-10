import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DashboardRedirect = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("selectedRole");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    switch (role) {
      case "student":
        navigate("/dashboard/student", { replace: true });
        break;
      case "faculty":
        navigate("/dashboard/faculty", { replace: true });
        break;
      case "alumni":
        navigate("/dashboard/alumni", { replace: true });
        break;
      default:
        navigate("/unauthorized", { replace: true });
    }
  }, [role, token, navigate]);

  return null;
};

export default DashboardRedirect;
