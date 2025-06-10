import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DashboardRedirect = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("selectedRole"); // Default to student if no role is set

  useEffect(() => {
    if (role === "student") {
      navigate("/dashboard/student", { replace: true });
    } else if (role === "faculty") {
      navigate("/dashboard/faculty", { replace: true });
    } else if (role === "alumni") {
      navigate("/dashboard/alumni", { replace: true });
    } else {
      navigate("/unauthorized", { replace: true });
    }
  }, [role, navigate]);

  return null;
};

export default DashboardRedirect;
