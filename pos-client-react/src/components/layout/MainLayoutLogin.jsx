import { Outlet, Link } from "react-router-dom";

const MainLayoutLogin = () => {
  return (
    <div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayoutLogin;
