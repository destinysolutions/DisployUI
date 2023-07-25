import React from "react";
import { Link } from "react-router-dom";
import '././../Styles/dashboard.css'

const Footer = () => {
  return (
    <div className="footer  text-center lg:text-base md:text-base z-10 sm:text-sm py-2 lg:ml-48 md:ml-48 sm:ml-0 xs:ml-0">
      <h6 className="font-medium">
        Securely display dashboards from any application
      </h6>
      <p>
        Find out more at <Link to="/">disploy.com</Link>
      </p>
    </div>
  );
};

export default Footer;
