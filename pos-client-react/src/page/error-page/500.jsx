import React from "react";
import { Button, Result } from "antd";
import { HomeOutlined, ReloadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Error500 = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh",
        paddingBottom: "100px",
        background: "transparent",
      }}
    >
      <Result
        status="500"
        title={
          <span
            style={{
              fontSize: "72px",
              fontWeight: "900",
              color: "#ff4d4f", // ពណ៌ក្រហម តំណាងឱ្យ Error
              letterSpacing: "4px",
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            500
          </span>
        }
        subTitle={
          <div style={{ marginTop: "10px" }}>
            <h2
              style={{ color: "#1a1a1a", fontWeight: "bold", fontSize: "24px" }}
            >
              មានបញ្ហាបច្ចេកទេសក្នុងប្រព័ន្ធ!
            </h2>
            <p style={{ color: "#8c8c8c", fontSize: "16px" }}>
              សុំទោស! ម៉ាស៊ីនមេ (Server) កំពុងជួបបញ្ហាមិនរំពឹងទុក។ <br />
              សូមព្យាយាមម្តងទៀត ឬទាក់ទងអ្នកបច្ចេកទេស ប្រសិនបើបញ្ហានៅតែបន្ត។
            </p>
          </div>
        }
        extra={
          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            <Button
              type="primary"
              icon={<HomeOutlined />}
              onClick={() => navigate("/")}
              style={{
                background: "#d4af37", // ពណ៌មាសដូចទំព័រ 404
                borderColor: "#d4af37",
                borderRadius: "6px",
                height: "40px",
              }}
            >
              ត្រឡប់ទៅទំព័រដើម
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => window.location.reload()}
              style={{
                borderRadius: "6px",
                height: "40px",
              }}
            >
              ព្យាយាមម្តងទៀត
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default Error500;
