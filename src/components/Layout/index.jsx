import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

// Layout component that wraps the Outlet in Header and Footer components
const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
