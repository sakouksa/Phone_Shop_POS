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
  theme, // បន្ថែម theme ពី antd
} from "antd";

// --- Import Icons ---
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
  AppstoreOutlined,
  QuestionCircleOutlined,
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

const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;

function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}

// --- រចនាសម្ព័ន្ធមឺនុយ (Data ដដែល) ---
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
    getItem("ប្រភេទរង", "/sub-category", <MdOutlinePhonelinkSetup />),
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

  // បន្ថែម State សម្រាប់ Dark/Light Mode
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
        <div style={{ padding: "16px", textAlign: "center", width: 220 }}>
          <Avatar src={profile?.image} size={64} icon={<UserOutlined />} />
          <div style={{ marginTop: 10, fontWeight: "bold", fontSize: 16 }}>
            {profile?.name || "អ្នកប្រើប្រាស់"}
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {profile?.role || "Admin"}
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
        token: {
          colorPrimary: "#3874ff",
          borderRadius: 8,
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
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          /* --- Responsive Breakpoint --- */
          breakpoint="lg"
          collapsedWidth="80"
          onBreakpoint={(broken) => {
            setCollapsed(broken);
          }}
          width={255}
          theme={isDarkMode ? "dark" : "light"}
          style={{
            borderRight: isDarkMode ? "1px solid #232e45" : "1px solid #f0f0f0",
            position: "fixed",
            height: "100vh",
            left: 0,
            zIndex: 1001,
            background: isDarkMode ? "#141824" : "#ffffff",
          }}
        >
          {/* --- Logo Header Section --- */}
          <div
            style={{
              height: 64,
              display: "flex",
              alignItems: "center",
              padding: "0 20px",
              marginBottom: 4,
            }}
          >
            <img
              src={logo}
              alt="logo"
              style={{
                width: 58,
                height: 32,
                borderRadius: 8,
                objectFit: "cover",
              }}
            />

            {!collapsed && (
              <div
                style={{
                  marginLeft: 12,
                  display: "flex",
                  alignItems: "center",
                  // បន្ថែម animation តិចៗពេលវាលោតចេញមក
                  animation: "fadeIn 0.3s ease-in-out",
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 18,
                    color: isDarkMode ? "#ffffff" : "#141824",
                    fontFamily: "'Kantumruy Pro', sans-serif",
                  }}
                >
                  ស៊ីវិល័យ
                </span>
                <span
                  style={{
                    marginLeft: 5,
                    fontWeight: 800,
                    fontSize: 16,
                    color: "#EC5325",
                  }}
                >
                  POS
                </span>
              </div>
            )}
          </div>

          {/* --- Menu Navigation --- */}
          <Menu
            mode="inline"
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            selectedKeys={[location.pathname]}
            items={items}
            onClick={(item) => navigate(item.key)}
            style={{
              borderRight: 0,
              height: "calc(100vh - 70px)",
              overflowY: "auto",
              background: "transparent",
            }}
          />

          {/* --- Custom Styling --- */}
          <style>
            {`
      @keyframes fadeIn {
        from { opacity: 0; transform: translateX(-5px); }
        to { opacity: 1; transform: translateX(0); }
      }

      .ant-layout-sider-children::-webkit-scrollbar {
        width: 4px;
      }
      .ant-layout-sider-children::-webkit-scrollbar-thumb {
        background: ${isDarkMode ? "#232e45" : "#e8e8e8"};
        border-radius: 10px;
      }
      .ant-menu-item {
        margin-top: 4px !important;
        margin-bottom: 4px !important;
      }
      .ant-menu-item-selected {
        background-color: ${isDarkMode ? "#3874ff15" : "#e3edff"} !important;
        color: #3874ff !important;
      }
      .ant-menu-item-selected::after {
        display: none; 
      }
    `}
          </style>
        </Sider>

        <Layout
          style={{
            marginLeft: collapsed ? 80 : 255,
            transition: "all 0.2s",
            background: isDarkMode ? "#0f111a" : "#f9fbfd",
          }}
        >
          {/* Header */}
          <Header
            style={{
              padding: "0 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: 64,
              // បន្ថែម Blur effect ដើម្បីឱ្យមើលទៅទំនើប
              backdropFilter: "blur(8px)",
              background: isDarkMode
                ? "rgba(20, 24, 36, 0.8)"
                : "rgba(255, 255, 255, 0.8)",
              borderBottom: isDarkMode
                ? "1px solid #232e45"
                : "1px solid #eef0f2",
              position: "sticky",
              top: 0,
              zIndex: 1000,
              boxShadow: isDarkMode ? "none" : "0 2px 4px rgba(0,0,0,0.02)",
            }}
          >
            <Space size={24}>
              {/* ប៊ូតុង Toggle Menu ដែលមាន Hover Effect */}
              <div
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 35,
                  height: 35,
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  background: isDarkMode ? "#1c2230" : "#f5f7fa",
                }}
                className="header-icon-hover"
              >
                {React.createElement(
                  collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                  {
                    style: { fontSize: 18, color: "#3874ff" },
                  },
                )}
              </div>

              {/* Search Bar ដែលមានស្ទីលបែប Floating */}
              <Input
                placeholder="ស្វែងរកអ្វីមួយនៅទីនេះ..."
                prefix={
                  <SearchOutlined
                    style={{ color: "#3874ff", marginRight: 8 }}
                  />
                }
                style={{
                  width: 350,
                  borderRadius: "10px",
                  background: isDarkMode ? "#1c2230" : "#f0f4f8",
                  border: "1px solid transparent",
                  height: 40,
                  transition: "all 0.3s",
                }}
                onFocus={(e) => (e.target.style.border = "1px solid #3874ff")}
                onBlur={(e) =>
                  (e.target.style.border = "1px solid transparent")
                }
              />
            </Space>

            <Space size={16}>
              {/* Theme Toggle Button */}
              <Button
                type="text"
                shape="circle"
                className="header-action-btn"
                icon={
                  isDarkMode ? (
                    <SunOutlined style={{ color: "#fadb14" }} />
                  ) : (
                    <MoonOutlined style={{ color: "#525b75" }} />
                  )
                }
                onClick={toggleTheme}
                style={{
                  fontSize: 18,
                  background: isDarkMode ? "#1c2230" : "#f5f7fa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />

              {/* Notification Badge */}
              <Badge count={5} size="small" offset={[-2, 5]} color="#ff4d4f">
                <Button
                  type="text"
                  shape="circle"
                  icon={
                    <BellOutlined style={{ color: "#525b75", fontSize: 20 }} />
                  }
                  style={{
                    background: isDarkMode ? "#1c2230" : "#f5f7fa",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
              </Badge>

              <div
                style={{
                  width: "1px",
                  height: "24px",
                  background: "#e3e6ed",
                  margin: "0 8px",
                }}
              />

              {/* User Profile Section */}
              <Dropdown
                menu={{ items: userMenuItems }}
                trigger={["click"]}
                placement="bottomRight"
                arrow={{ pointAtCenter: true }}
              >
                <Space
                  style={{
                    cursor: "pointer",
                    padding: "4px 8px",
                    borderRadius: "8px",
                    transition: "all 0.3s",
                  }}
                  className="user-dropdown-hover"
                >
                  <Avatar
                    src={profile?.image}
                    size={38}
                    style={{
                      border: "2px solid #3874ff",
                      boxShadow: "0 2px 8px rgba(56, 116, 255, 0.2)",
                    }}
                    icon={<UserOutlined />}
                  />
                  {!collapsed && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        lineHeight: "1.2",
                      }}
                    >
                      <Text
                        strong
                        style={{
                          fontSize: "14px",
                          color: isDarkMode ? "#fff" : "#141824",
                        }}
                      >
                        {profile?.name}
                      </Text>
                      <Text type="secondary" style={{ fontSize: "11px" }}>
                        {profile?.role}
                      </Text>
                    </div>
                  )}
                </Space>
              </Dropdown>
            </Space>
          </Header>

          {/* Page Content */}
          <Content
            style={{ padding: "24px", minHeight: "calc(100vh - 128px)" }}
          >
            <div
              style={{
                maxWidth: 1600,
                margin: "0 auto",
                background: isDarkMode ? "#141824" : "#ffffff",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <Outlet />
            </div>
          </Content>

          <Footer
            style={{
              textAlign: "center",
              background: "transparent",
              color: "#94a3b8",
            }}
          >
            <b>ប្រព័ន្ធគ្រប់គ្រងហាងទូរស័ព្ទ</b> ©{new Date().getFullYear()} -
            ឆ្លាតវៃ និងទំនើប
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default MainLayout;
