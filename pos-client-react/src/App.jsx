import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./page/home/HomePage";
import AboutPage from "./page/about/AboutPage";
import LoginPage from "./page/auth/LoginPage";
import RegisterPage from "./page/auth/RegisterPage";
import RouteNoFound from "./page/error-page/404.jsx";
import Error500 from "./page/error-page/500";
import MainLayout from "./components/layout/MainLayout";
import MainLayoutLogin from "./components/layout/MainLayoutLogin";
import CustomerPage from "./page/customer/CustomerPage";
import ProductPage from "./page/product/ProductPage";
import RolePage from "./page/role/RolePage";
import { ConfigProvider, App as AntdApp } from "antd"; // Import AntdApp
import "@fontsource/kantumruy-pro";
import "@fontsource/kantumruy-pro/700.css";
import CategoryPage from "./page/category/CategoryPage";
import ProvincePage from "./page/province/ProvincePage";
import SubCategoryPage from "./page/category/SubCategoryPage.jsx";
import BrandPage from "./page/brand/BrandPage.jsx";
import SupplierPage from "./page/supplier/SupplierPage.jsx";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "'Kantumruy Pro', sans-serif",
          fontSize: 15,
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          {/* Layout Main */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/sub_category" element={<SubCategoryPage />} />
            <Route path="/role" element={<RolePage />} />
            <Route path="/category" element={<CategoryPage />} />
            <Route path="/brand" element={<BrandPage />} />
            <Route path="/province" element={<ProvincePage />} />
            <Route path="/supplier" element={<SupplierPage />} />
            <Route path="*" element={<RouteNoFound />} />
            <Route path="/500" element={<Error500 />} />
          </Route>

          {/* Layout Login */}
          <Route element={<MainLayoutLogin />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<RouteNoFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
