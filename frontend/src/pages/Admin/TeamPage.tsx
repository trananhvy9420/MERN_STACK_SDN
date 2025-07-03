import React, { useEffect } from "react";
import Header from "../Header";
import Footer from "../Footer";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import TableTeam from "./TableTeam";
const TeamPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    console.log(user);

    // Nếu không có user hoặc không phải admin thì redirect về "/"
    if (!user || user.isAdmin === false) {
      toast.error("Bạn không được truy cập vô đây ( 403 Forbidden ) ");
      navigate("/");
    }
  }, [navigate]);

  return (
    <div>
      <div>
        <Header />
      </div>
      <div>
        <TableTeam />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default TeamPage;
