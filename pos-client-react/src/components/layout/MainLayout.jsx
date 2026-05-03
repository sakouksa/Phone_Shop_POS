import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Layout, ConfigProvider, theme } from "antd";

import Sidebar from "./Sidebar";
import CustomHeader from "./Header";
import Footer from "./Footer";

import { profileStore } from "../../store/profileStore";
import config from "../../util/config";

const { Content } = Layout;

const MainLayout = () => {
  const { profile, logout } = profileStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    if (!profile) navigate("/login");
  }, [profile, navigate]);

  useEffect(() => {
    const currentPath = location.pathname;
    const findParentKey = (menuItems) => {
      // Find parent key based on path for active menu tracking
    };
  }, [location.pathname]);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  if (!profile) return null;

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: "#3874ff",
          borderRadius: 8,
          fontFamily: "Kantumruy Pro, Inter, sans-serif",
        },
        components: {
          Layout: {
            headerBg: isDarkMode ? "#141824" : "#ffffff",
            siderBg: isDarkMode ? "#141824" : "#ffffff",
          },
          Menu: {
            itemBg: "transparent",
            itemSelectedBg: isDarkMode ? "#3874ff20" : "#e3edff",
            itemSelectedColor: "#3874ff",
            itemColor: isDarkMode ? "#a5acb8" : "#525b75",
            itemHoverBg: isDarkMode ? "#ffffff10" : "#f5f7fa",
          },
        },
      }}
    >
      <Layout className="min-h-screen">
        {/* Sidebar Component */}
        <Sidebar
          collapsed={collapsed}
          isDarkMode={isDarkMode}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          location={location}
          navigate={navigate}
        />

        <Layout
          className="transition-all duration-200"
          style={{
            marginLeft: collapsed ? 80 : 255,
            background: isDarkMode ? "#0f111a" : "#f9fbfd",
          }}
        >
          {/* Header Component */}
          <CustomHeader
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            profile={profile}
            logout={logout}
            config={config}
          />

          <Content className="p-6 min-h-[calc(100vh-128px)]">
            <div
              className={`max-w-[1600px] mx-auto p-5 rounded-xl shadow-sm border transition-colors ${
                isDarkMode
                  ? "bg-[#141824] border-[#232e45]"
                  : "bg-white border-transparent"
              }`}
            >
              <Outlet />
            </div>
          </Content>

          {/* Footer Component */}
          <Footer />
        </Layout>
      </Layout>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
            background: ${isDarkMode ? "#232e45" : "#e8e8e8"}; 
            border-radius: 10px; 
        }
        .ant-menu-item { margin-top: 4px !important; margin-bottom: 4px !important; }
        .ant-menu-item-selected::after { display: none !important; }
      `}</style>
    </ConfigProvider>
  );
};

export default MainLayout;
