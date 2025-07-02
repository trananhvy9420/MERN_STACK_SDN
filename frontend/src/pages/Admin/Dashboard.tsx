import React, { useEffect } from "react";
import Header from "../Header";
import Footer from "../Footer";
import TablePlayer from "./TablePlayer";
const Dashboard = () => {
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
