import React from "react";
import Header from "../Header";
import Footer from "../Footer";
import TableTeam from "./TableTeam";
const TeamPage: React.FC = () => {
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
