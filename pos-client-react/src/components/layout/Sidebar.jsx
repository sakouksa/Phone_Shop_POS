import React from "react";
import { Layout, Menu } from "antd";
import {
  ToolOutlined,
  FileTextOutlined,
  BarcodeOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  ThunderboltFilled,
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
// Import custom CSS for Sidebar
import "../../assets/css/Sidebar.css";


const { Sider } = Layout;

function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}

export const sidebarItems = [
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
    getItem("គ្រប់គ្រងលេខ IMEI", "/imei_tracking", <BarcodeOutlined />),
    getItem("ប្រភេទផលិតផល", "/category", <BiCategoryAlt />),
    getItem("ប្រភេទរង", "/sub_category", <MdOutlinePhonelinkSetup />),
    getItem("ម៉ាក/ម៉ូដែល", "/brand", <MdOutlineLanguage />),
  ]),
  getItem("ការទិញចូល", "purchase", <CiCloudOn />, [
    getItem("បញ្ជីទិញចូល", "/purchase_orders", <AiOutlineShoppingCart />),
    getItem(
      "ទំនិញលម្អិតពេលទិញចូល",
      "/purchase_order_items",
      <AiOutlineShoppingCart />,
    ),
    getItem("អ្នកផ្គត់ផ្គង់", "/supplier", <RiUserSharedLine />),
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

const Sidebar = ({
  collapsed,
  isDarkMode,
  openKeys,
  onOpenChange,
  location,
  navigate,
}) => {
  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      breakpoint="lg"
      collapsedWidth="80"
      width={260}
      theme={isDarkMode ? "dark" : "light"}
      className={`fixed h-screen left-0 top-0 z-[1001] transition-all duration-200 border-r ${
        isDarkMode
          ? "border-[#232e45] bg-[#141824]"
          : "border-[#f0f0f0] bg-white shadow-sm"
      }`}
    >
      {/* Logo Section */}
      <div className="h-[70px] flex items-center px-5 justify-between border-b border-dashed border-[#e2e8f0]/20">
        <div className="flex items-center">
          {/* Icon និង Background សម្រាប់ហាងទូរស័ព្ទ */}
          <div className="w-[38px] h-[38px] rounded-xl bg-gradient-to-tr from-[#EC5325] to-[#f87c55] flex items-center justify-center text-white shadow-lg shadow-[#ec52253b]">
            <BsPhoneFlip className="text-lg" />
          </div>

          {!collapsed && (
            <div className="ml-3 flex flex-col justify-center animate-in fade-in slide-in-from-left-2 duration-300">
              {/* ឈ្មោះហាង (អ្នកអាចកែឈ្មោះតាមចិត្តចង់បាន) */}
              <span
                className={`font-bold text-base tracking-tight font-['Kantumruy_Pro'] leading-tight ${
                  isDarkMode ? "text-white" : "text-[#141824]"
                }`}
              >
                POS Mobile
              </span>
              <span className="text-[10px] font-medium tracking-wider text-gray-500 uppercase">
                Phone & Accessories
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Menu Section */}
      <Menu
        mode="inline"
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        selectedKeys={[location.pathname]}
        items={sidebarItems}
        onClick={(item) => navigate(item.key)}
        className={`border-r-0 h-[calc(100vh-70px)] overflow-y-auto bg-transparent px-3 py-4 space-y-1 custom-scrollbar ${
          isDarkMode ? "dark-menu" : "light-menu"
        }`}
      />
    </Sider>
  );
};

export default Sidebar;
