import React from "react";
import { Button, Result } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const RouteNoFound = () => {
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
        status="404"
        title={
          <span
            style={{
              fontSize: "80px",
              fontWeight: "900",
              color: "#d4af37", // ពណ៌មាស ស៊ីជាមួយ Logo ហាងទូរស័ព្ទ
              letterSpacing: "6px",
              textShadow: "3px 3px 6px rgba(0,0,0,0.1)",
            }}
          >
            404
          </span>
        }
        subTitle={
          <div style={{ marginTop: "10px" }}>
            <h2
              style={{
                color: "#1a1a1a",
                fontWeight: "bold",
                fontSize: "26px",
                marginBottom: "15px",
              }}
            >
              រកមិនឃើញទំព័រដែលអ្នកស្វែងរក!
            </h2>
            <p
              style={{ color: "#8c8c8c", fontSize: "16px", lineHeight: "1.6" }}
            >
              សុំទោស! ទំព័រដែលអ្នកកំពុងព្យាយាមចូលមើល ប្រហែលជាត្រូវបានផ្លាស់ប្តូរ
              <br />
              ឬអាសយដ្ឋាន URL មិនត្រឹមត្រូវ។
            </p>
          </div>
        }
        extra={
          <Button
            type="primary"
            size="large"
            icon={<HomeOutlined />}
            onClick={() => navigate("/")}
            style={{
              background: "#d4af37",
              borderColor: "#d4af37",
              borderRadius: "8px",
              height: "45px",
              padding: "0 30px",
              fontSize: "16px",
              fontWeight: "600",
              boxShadow: "0 4px 10px rgba(212, 175, 55, 0.3)",
            }}
          >
            ត្រឡប់ទៅទំព័រដើម
          </Button>
        }
      />
    </div>
  );
};

export default RouteNoFound;
