import React from "react";
import { Layout } from "antd";

const { Footer: AntFooter } = Layout;

const Footer = () => {
  return (
    <AntFooter className="text-center bg-transparent text-slate-400 py-6">
      <span className="font-bold">ប្រព័ន្ធគ្រប់គ្រងហាងទូរស័ព្ទ</span> ©
      {new Date().getFullYear()} - ឆ្លាតវៃ និងទំនើប
    </AntFooter>
  );
};

export default Footer;
