import React, { useEffect } from "react";
import Header from "../Header";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer";
import TablePlayer from "./TablePlayer";
import { toast } from "sonner";
const Dashboard = () => {
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
        <TablePlayer />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
