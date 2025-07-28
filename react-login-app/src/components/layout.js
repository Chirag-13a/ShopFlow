
import React from "react";
import Header from "./header";
import Fotter from "./fotter";  
import { Outlet } from "react-router-dom";
import Chat from "./chat";
import ScrollToTopButton from "./scroll";

const Layout = () => {
  return (
    <>
      <Header />
      
      <Outlet />
      <Fotter />
      <Chat/>
      <ScrollToTopButton/>
    </>
  );
};

export default Layout;
