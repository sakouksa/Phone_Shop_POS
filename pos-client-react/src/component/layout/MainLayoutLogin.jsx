import { Outlet, Link } from "react-router-dom";

const MainLayoutLogin = () => {
  return (
    <div>
      <div style={{ backgroundColor: "pink", padding: 10 }}>
        <div>Brand Name</div>
        <div>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayoutLogin;
