import { Spin } from "antd";
import React from "react";

export default function MainPage({ loading = false, children }) {
  return (
    <Spin spinning={loading}>{children}</Spin>
  );
}
