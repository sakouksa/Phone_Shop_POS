import { PlusOutlined } from "@ant-design/icons";
import React from "react";

function UploadButton() {
  return (
    <div>
      <button style={{ border: 0, background: "none" }} type="button">
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </button>
    </div>
  );
}

export default UploadButton;
