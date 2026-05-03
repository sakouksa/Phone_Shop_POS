import React from "react";
import {
  Layout,
  Input,
  Button,
  Badge,
  Dropdown,
  Avatar,
  Typography,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  SunOutlined,
  MoonOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const CustomHeader = ({
  collapsed,
  setCollapsed,
  isDarkMode,
  toggleTheme,
  profile,
  logout,
  config,
}) => {
  const userMenuItems = [
    {
      key: "user-card",
      label: (
        <div className="p-4 text-center w-[220px]">
          <Avatar
            src={
              config?.image_path
                ? config.image_path + profile?.image
                : undefined
            }
            size={64}
            icon={<UserOutlined />}
            className="shadow-sm border-2 border-[#ec5325]/20"
          />
          <div className="mt-2.5 font-bold text-base text-inherit">
            {profile?.name || "ស៊ីវិល័យ"}
          </div>
          <Text type="secondary" className="text-xs">
            {profile?.type || profile?.role || "Administrator"}
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
    <AntHeader
      className={`sticky top-0 z-[1000] h-[70px] px-6 flex items-center justify-between backdrop-blur-md border-b transition-colors duration-300 ${
        isDarkMode
          ? "bg-[#141824]/90 border-[#232e45]"
          : "bg-white/90 border-[#f1f5f9] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]"
      }`}
    >
      {/* ផ្នែកខាងឆ្វេង៖ ប៊ូតុងបិទ/បើក និងប្រអប់ស្វែងរក */}
      <div className="flex items-center gap-6">
        <div
          onClick={() =>
            setCollapsed
          } /* កែតម្រូវត្រង់នេះដើម្បីកុំឱ្យ Error ពេលចុច */
          onClick={() => setCollapsed(!collapsed)}
          className={`flex items-center justify-center w-9 h-9 rounded-xl cursor-pointer transition-all active:scale-95 ${
            isDarkMode
              ? "bg-[#1c2230] text-[#ec5325]"
              : "bg-[#fdf2e9] text-[#ec5325] hover:bg-[#fae4ce]"
          }`}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "text-lg",
            },
          )}
        </div>

        <Input
          placeholder="ស្វែងរកទូរស័ព្ទនៅទីនេះ..."
          prefix={<SearchOutlined className="text-[#ec5325] mr-2" />}
          className={`w-[360px] h-10 rounded-xl border-transparent transition-all focus:border-[#ec5325] hidden md:flex ${
            isDarkMode
              ? "bg-[#1c2230] text-white hover:bg-[#232e45] placeholder-gray-500"
              : "bg-[#f8fafc] text-gray-800 hover:bg-[#f1f5f9] border border-gray-100 placeholder-gray-400"
          }`}
        />
      </div>

      <div className="flex items-center gap-4">
        <Button
          type="text"
          shape="circle"
          onClick={toggleTheme}
          className={`flex items-center justify-center text-lg w-10 h-10 transition-all ${
            isDarkMode
              ? "bg-[#1c2230] text-yellow-400 hover:bg-[#232e45]"
              : "bg-[#f8fafc] text-[#525b75] hover:bg-[#f1f5f9] border border-gray-100"
          }`}
          icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
        />

        <Badge count={5} size="small" offset={[-4, 6]} color="#ec5325">
          <Button
            type="text"
            shape="circle"
            className={`flex items-center justify-center w-10 h-10 transition-all ${
              isDarkMode
                ? "bg-[#1c2230] text-white hover:bg-[#232e45]"
                : "bg-[#f8fafc] text-[#525b75] hover:bg-[#f1f5f9] border border-gray-100"
            }`}
            icon={<BellOutlined className="text-xl" />}
          />
        </Badge>

        <div className="w-[1px] h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

        <Dropdown
          menu={{ items: userMenuItems }}
          trigger={["click"]}
          placement="bottomRight"
          arrow
        >
          <div className="flex items-center gap-3 p-1.5 rounded-xl cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-all">
            <Avatar
              src={
                config?.image_path
                  ? config.image_path + profile?.image
                  : undefined
              }
              size={38}
              className="border-2 border-[#ec5325] shadow-[0_4px_12px_rgba(236,83,37,0.25)]"
              icon={<UserOutlined />}
            />
            <div className="flex-col leading-tight hidden sm:flex">
              <Text
                strong
                className={`text-sm ${
                  isDarkMode ? "text-white" : "text-[#141824]"
                }`}
              >
                {profile?.name || "ស៊ីវិល័យ"}
              </Text>
              <Text
                type="secondary"
                className="text-[10px] text-gray-500 uppercase tracking-wide"
              >
                {profile?.type || "Administrator"}
              </Text>
            </div>
          </div>
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default CustomHeader;
