import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="text-center lg:text-base md:text-base z-10 sm:text-sm py-2 my-4">
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
