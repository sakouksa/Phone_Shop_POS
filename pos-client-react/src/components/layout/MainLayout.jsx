import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Layout,
  Menu,
  Input,
  Space,
  Avatar,
  Badge,
  Dropdown,
  ConfigProvider,
  Typography,
  Button,
  theme,
} from "antd";

// --- Icons ---
import {
  UserOutlined,
  SettingOutlined,
  BellOutlined,
  LogoutOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  BarcodeOutlined,
  ToolOutlined,
  FileTextOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons";

import {
  MdDashboardCustomize,
  MdPointOfSale,
  MdProductionQuantityLimits,
  MdOutlinePayments,
  MdOutlineLanguage,
  MdOutlineLocationCity,
  MdOutlinePhonelinkSetup,
} from "react-icons/md";

import { RiCustomerService2Fill, RiUserSharedLine } from "react-icons/ri";
import { BiCategoryAlt, BiSolidUserBadge, BiMobileAlt } from "react-icons/bi";
import { AiOutlineShoppingCart, AiOutlineUsergroupAdd } from "react-icons/ai";
import { BsCashStack, BsPhoneFlip } from "react-icons/bs";
import { CiCloudOn } from "react-icons/ci";

import logo from "../../assets/img/logo.png";
import { profileStore } from "../../store/profileStore";
import config from "../../util/config";

const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;

function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}

const items = [
  getItem("ផ្ទាំងគ្រប់គ្រង", "/", <MdDashboardCustomize />),
  getItem("ផ្នែកលក់ទូរស័ព្ទ", "sales", <MdPointOfSale />, [
    getItem("ផ្ទាំងលក់ POS", "/pos", <MdPointOfSale />),
    getItem("ប្តូរគ្រឿង/វាយដូរ", "/exchange", <BsPhoneFlip />),
    getItem("បញ្ជីលក់/វិក្កយបត្រ", "/orders", <AiOutlineShoppingCart />),
  ]),
  getItem("សេវាកម្មជួសជុល", "repair", <ToolOutlined />, [
    getItem("បញ្ជីទទួលជួសជុល", "/repair", <MdOutlinePhonelinkSetup />),
    getItem("ប្រភេទសេវាកម្ម", "/repair-type", <BiCategoryAlt />),
  ]),
  getItem("សារពើភ័ណ្ឌ", "inventory", <BiMobileAlt />, [
    getItem(
      "បញ្ជីទូរស័ព្ទ/គ្រឿងបន្លាស់",
      "/product",
      <MdProductionQuantityLimits />,
    ),
    getItem("គ្រប់គ្រងលេខ IMEI", "/imei-tracking", <BarcodeOutlined />),
    getItem("ប្រភេទផលិតផល", "/category", <BiCategoryAlt />),
    getItem("ប្រភេទរង", "/sub_category", <MdOutlinePhonelinkSetup />),
    getItem("ម៉ាក/ម៉ូដែល", "/brand", <MdOutlineLanguage />),
  ]),
  getItem("របាយការណ៍", "report", <FileTextOutlined />, [
    getItem("របាយការណ៍លក់", "/report/to_sales", <BsCashStack />),
    getItem("របាយការណ៍ស្តុក IMEI", "/report/imei", <BarcodeOutlined />),
    getItem("របាយការណ៍ទិញចូល", "/report/purchase", <AiOutlineShoppingCart />),
    getItem("របាយការណ៍ចំណាយ", "/report/expense", <MdOutlinePayments />),
  ]),
  getItem("អតិថិជន", "customer", <RiCustomerService2Fill />, [
    getItem("បញ្ជីអតិថិជន", "/customer", <AiOutlineUsergroupAdd />),
    getItem("ប្រភេទអតិថិជន", "/customer_type", <BiCategoryAlt />),
  ]),
  getItem("ការទិញចូល", "purchase", <CiCloudOn />, [
    getItem("បញ្ជីទិញចូល", "/purchase", <AiOutlineShoppingCart />),
    getItem("អ្នកផ្គត់ផ្គង់", "/supplier", <RiUserSharedLine />),
  ]),
  getItem("ចំណាយផ្សេងៗ", "expense", <BsCashStack />, [
    getItem("បញ្ជីចំណាយ", "/expense", <MdOutlinePayments />),
    getItem("ប្រភេទចំណាយ", "/expense-type", <BiCategoryAlt />),
  ]),
  getItem("បុគ្គលិក", "employee", <AiOutlineUsergroupAdd />, [
    getItem("បញ្ជីបុគ្គលិក", "/employee", <UserOutlined />),
    getItem("បើកប្រាក់បៀវត្ស", "/payroll", <BsCashStack />),
  ]),
  getItem("អ្នកប្រើប្រាស់", "user", <UserOutlined />, [
    getItem("បញ្ជីអ្នកប្រើប្រាស់", "/list", <UserOutlined />),
    getItem("កំណត់តួនាទី", "/role", <BiSolidUserBadge />),
    getItem("សិទ្ធិប្រើប្រាស់", "/permission", <SafetyCertificateOutlined />),
  ]),
  getItem("ការកំណត់", "settings", <SettingOutlined />, [
    getItem("ភាសា", "/lang", <MdOutlineLanguage />),
    getItem("ខេត្ត/ក្រុង", "/province", <MdOutlineLocationCity />),
    getItem("រូបិយវត្ថុ", "/currency", <BsCashStack />),
    getItem(
      "វិធីសាស្ត្រទូទាត់ប្រាក់",
      "/payment_method",
      <MdOutlinePayments />,
    ),
  ]),
];

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
      for (const item of menuItems) {
        if (item.children) {
          if (item.children.some((child) => child.key === currentPath))
            return item.key;
          const nestedKey = findParentKey(item.children);
          if (nestedKey) return item.key;
        }
      }
      return null;
    };
    const parentKey = findParentKey(items);
    if (parentKey) setOpenKeys([parentKey]);
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

  const userMenuItems = [
    {
      key: "user-card",
      label: (
        <div className="p-4 text-center w-[220px]">
          <Avatar src={config.image_path + profile?.image} size={64} icon={<UserOutlined />} />
          <div className="mt-2.5 font-bold text-base text-inherit">
            {profile?.name || "អ្នកប្រើប្រាស់"}
          </div>
          <Text type="secondary" className="text-xs">
            {profile?.type || "Admin"}
          </Text>
        </div>
      ),
    },
    { type: "divider" },
    { key: "profile", label: "ព័ត៌មានផ្ទាល់ខ្លួន", icon: <UserOutlined /> },
    { key: "settings", label: "ការកំណត់ & ឯកជនភាព", icon: <SettingOutlined /> },
    { type: "divider" },
    {
      key: "logout",
      label: (
        <Button
          block
          danger
          type="text"
          icon={<LogoutOutlined />}
          onClick={logout}
        >
          ចាកចេញ
        </Button>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: { colorPrimary: "#3874ff", borderRadius: 8 },
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
        {/* --- Sider --- */}
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="lg"
          collapsedWidth="80"
          onBreakpoint={setCollapsed}
          width={255}
          theme={isDarkMode ? "dark" : "light"}
          className={`fixed h-screen left-0 z-[1001] transition-all duration-200 border-r ${
            isDarkMode
              ? "border-[#232e45] bg-[#141824]"
              : "border-[#f0f0f0] bg-white"
          }`}
        >
          {/* Logo Section */}
          <div className="h-16 flex items-center px-5 mb-1">
            <img
              src={logo}
              alt="logo"
              className="w-[58px] h-[32px] rounded-lg object-cover"
            />
            {!collapsed && (
              <div className="ml-3 flex items-center animate-in fade-in slide-in-from-left-2 duration-300">
                <span
                  className={`font-bold text-lg font-['Kantumruy_Pro'] ${isDarkMode ? "text-white" : "text-[#141824]"}`}
                >
                  ស៊ីវិល័យ
                </span>
                <span className="ml-1 font-extrabold text-base text-[#EC5325]">
                  POS
                </span>
              </div>
            )}
          </div>

          {/* Menu */}
          <Menu
            mode="inline"
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            selectedKeys={[location.pathname]}
            items={items}
            onClick={(item) => navigate(item.key)}
            className="border-r-0 h-[calc(100vh-70px)] overflow-y-auto bg-transparent custom-scrollbar"
          />
        </Sider>

        {/* --- Main Content Layout --- */}
        <Layout
          className="transition-all duration-200"
          style={{
            marginLeft: collapsed ? 80 : 255,
            background: isDarkMode ? "#0f111a" : "#f9fbfd",
          }}
        >
          {/* Header */}
          <Header
            className={`sticky top-0 z-[1000] h-16 px-6 flex items-center justify-between backdrop-blur-md border-b transition-colors duration-300 ${
              isDarkMode
                ? "bg-[#141824]/80 border-[#232e45]"
                : "bg-white/80 border-[#eef0f2] shadow-sm"
            }`}
          >
            <div className="flex items-center gap-6">
              {/* Toggle Button */}
              <div
                onClick={() => setCollapsed(!collapsed)}
                className={`flex items-center justify-center w-9 h-9 rounded-lg cursor-pointer transition-all active:scale-95 ${
                  isDarkMode ? "bg-[#1c2230]" : "bg-[#f5f7fa]"
                }`}
              >
                {React.createElement(
                  collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                  {
                    className: "text-lg text-[#3874ff]",
                  },
                )}
              </div>

              {/* Search Bar */}
              <Input
                placeholder="ស្វែងរកអ្វីមួយនៅទីនេះ..."
                prefix={<SearchOutlined className="text-[#3874ff] mr-2" />}
                className={`w-[350px] h-10 rounded-xl border-transparent transition-all focus:border-[#3874ff] hidden md:flex ${
                  isDarkMode
                    ? "bg-[#1c2230] hover:bg-[#232e45]"
                    : "bg-[#f0f4f8] hover:bg-[#e6ebf1]"
                }`}
              />
            </div>

            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <Button
                type="text"
                shape="circle"
                onClick={toggleTheme}
                className={`flex items-center justify-center text-lg ${isDarkMode ? "bg-[#1c2230]" : "bg-[#f5f7fa]"}`}
                icon={
                  isDarkMode ? (
                    <SunOutlined className="text-yellow-400" />
                  ) : (
                    <MoonOutlined className="text-[#525b75]" />
                  )
                }
              />

              {/* Notifications */}
              <Badge count={5} size="small" offset={[-2, 5]} color="#ff4d4f">
                <Button
                  type="text"
                  shape="circle"
                  className={`flex items-center justify-center ${isDarkMode ? "bg-[#1c2230]" : "bg-[#f5f7fa]"}`}
                  icon={<BellOutlined className="text-xl text-[#525b75]" />}
                />
              </Badge>

              <div className="w-[1px] h-6 bg-[#e3e6ed] mx-2" />

              {/* Profile Dropdown */}
              <Dropdown
                menu={{ items: userMenuItems }}
                trigger={["click"]}
                placement="bottomRight"
                arrow
              >
                <div className="flex items-center gap-2 p-1 rounded-lg cursor-pointer hover:bg-black/5 transition-colors">
                  <Avatar
                    src={config.image_path + profile?.image}
                    size={38}
                    className="border-2 border-[#3874ff] shadow-[0_2px_8px_rgba(56,116,255,0.2)]"
                    icon={<UserOutlined />}
                  />
                  {!collapsed && (
                    <div className="flex flex-col leading-tight">
                      <Text
                        strong
                        className={`text-sm ${isDarkMode ? "text-white" : "text-[#141824]"}`}
                      >
                        {profile?.name}
                      </Text>
                      <Text type="secondary" className="text-[11px]">
                        {profile?.role}
                      </Text>
                    </div>
                  )}
                </div>
              </Dropdown>
            </div>
          </Header>

          {/* Page Content */}
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

          <Footer className="text-center bg-transparent text-slate-400 py-6">
            <span className="font-bold">ប្រព័ន្ធគ្រប់គ្រងហាងទូរស័ព្ទ</span> ©
            {new Date().getFullYear()} - ឆ្លាតវៃ និងទំនើប
          </Footer>
        </Layout>
      </Layout>

      {/* Tailwind Custom Utilities for Ant Design Overrides */}
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
