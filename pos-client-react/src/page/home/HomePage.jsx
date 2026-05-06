import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Radio,
  Select,
  Table,
  Badge,
  Tag,
  Space,
} from "antd";
import {
  EyeOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UsergroupAddOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  MobileOutlined,
  DollarOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const { Title: AntTitle, Text, Paragraph } = Typography;
const { Option } = Select;

const HomePage = () => {
  const [loading, setLoading] = useState(false);

  const lineData = {
    labels: [
      "មករា",
      "កុម្ភៈ",
      "មីនា",
      "មេសា",
      "ឧសភា",
      "មិថុនា",
      "កក្កដា",
      "សីហា",
      "កញ្ញា",
      "តុលា",
      "វិច្ឆិកា",
      "ធ្នូ",
    ],
    datasets: [
      {
        label: "ចំណូលសរុប ($)",
        data: [
          1200, 1900, 3000, 5000, 2400, 3100, 4200, 3800, 4500, 4900, 5300,
          6200,
        ],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.15)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "ការលក់ ($)",
        data: [
          1000, 1500, 2700, 4500, 2000, 2800, 3900, 3500, 4100, 4400, 4900,
          5800,
        ],
        borderColor: "#06b6d4",
        backgroundColor: "rgba(6, 182, 212, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          font: {
            family: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
            size: 12,
          },
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 8000,
        grid: { color: "#f3f4f6" },
        ticks: { color: "#6b7280" },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#6b7280" },
      },
    },
  };

  const barData = {
    labels: [
      "ច័ន្ទ",
      "អង្គារ",
      "ពុធ",
      "ព្រហស្បតិ៍",
      "សុក្រ",
      "សៅរ៍",
      "អាទិត្យ",
    ],
    datasets: [
      {
        label: "ចំនួនលក់",
        data: [12, 19, 15, 25, 22, 30, 28],
        backgroundColor: "#3b82f6",
        borderRadius: 8,
      },
      {
        label: "ប្រាក់ចំណេញ ($)",
        data: [350, 500, 420, 750, 680, 900, 850],
        backgroundColor: "#93c5fd",
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: { color: "#6b7280" },
      },
      y: {
        stacked: true,
        grid: { color: "#f3f4f6" },
        ticks: { color: "#6b7280" },
      },
    },
  };

  const columns = [
    {
      title: "លេខរៀង",
      dataIndex: "key",
      key: "key",
      width: 80,
    },
    {
      title: "ឈ្មោះទំនិញ",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <Text strong className="text-gray-800">
          {text}
        </Text>
      ),
    },
    {
      title: "ប្រភេទ",
      dataIndex: "category",
      key: "category",
      render: (category) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: "តម្លៃលក់ ($)",
      dataIndex: "price",
      key: "price",
      align: "right",
      render: (price) => (
        <Text type="success" strong>
          ${price}
        </Text>
      ),
    },
    {
      title: "ចំនួនលក់",
      dataIndex: "sold",
      key: "sold",
      align: "center",
      render: (sold) => (
        <Badge count={sold} style={{ backgroundColor: "#22c55e" }} />
      ),
    },
  ];

  const dataSource = [
    {
      key: "1",
      name: "iPhone 15 Pro Max",
      category: "Smartphone",
      price: "1,199",
      sold: 45,
    },
    {
      key: "2",
      name: "Samsung Galaxy S24 Ultra",
      category: "Smartphone",
      price: "1,299",
      sold: 38,
    },
    {
      key: "3",
      name: "iPad Pro M4",
      category: "Tablet",
      price: "999",
      sold: 25,
    },
    {
      key: "4",
      name: "AirPods Pro 2nd Gen",
      category: "Accessories",
      price: "249",
      sold: 40,
    },
  ];

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <AntTitle level={3} className="m-0 text-gray-800 font-bold">
            ទំព័រដើម (Dashboard)
          </AntTitle>
          <Paragraph type="secondary" className="m-0">
            ប្រព័ន្ធគ្រប់គ្រងហាងលក់ទូរស័ព្ទ និងសេវាកម្ម (Phone Shop System)
          </Paragraph>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <Tag color="cyan" className="py-1 px-3 text-sm rounded-full">
            <MobileOutlined /> ឃ្លាំងទូរស័ព្ទ
          </Tag>
          <Tag color="green" className="py-1 px-3 text-sm rounded-full">
            <DollarOutlined /> គណនេយ្យ/POS
          </Tag>
          <Tag color="orange" className="py-1 px-3 text-sm rounded-full">
            <ToolOutlined /> ជួសជុលទូរស័ព្ទ
          </Tag>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-0 rounded-2xl bg-white hover:shadow-md transition-all">
            <div className="flex justify-between items-center mb-4">
              <span className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <EyeOutlined className="text-2xl" />
              </span>
              <span className="text-green-600 text-sm font-semibold flex items-center bg-green-50 px-2 py-1 rounded-md">
                <ArrowUpOutlined className="mr-1" /> +12.5%
              </span>
            </div>
            <div>
              <AntTitle level={3} className="m-0 font-extrabold text-gray-900">
                3,456
              </AntTitle>
              <Text type="secondary" className="block mt-1 font-medium">
                ចំនួនអ្នកទស្សនាហាង
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-0 rounded-2xl bg-white hover:shadow-md transition-all">
            <div className="flex justify-between items-center mb-4">
              <span className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <ShoppingCartOutlined className="text-2xl" />
              </span>
              <span className="text-green-600 text-sm font-semibold flex items-center bg-green-50 px-2 py-1 rounded-md">
                <ArrowUpOutlined className="mr-1" /> +8.3%
              </span>
            </div>
            <div>
              <AntTitle level={3} className="m-0 font-extrabold text-gray-900">
                $45,200
              </AntTitle>
              <Text type="secondary" className="block mt-1 font-medium">
                ប្រាក់ចំណូលសរុប
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-0 rounded-2xl bg-white hover:shadow-md transition-all">
            <div className="flex justify-between items-center mb-4">
              <span className="p-3 bg-cyan-50 text-cyan-600 rounded-xl">
                <ShoppingOutlined className="text-2xl" />
              </span>
              <span className="text-red-600 text-sm font-semibold flex items-center bg-red-50 px-2 py-1 rounded-md">
                <ArrowDownOutlined className="mr-1" /> -2.4%
              </span>
            </div>
            <div>
              <AntTitle level={3} className="m-0 font-extrabold text-gray-900">
                2,450
              </AntTitle>
              <Text type="secondary" className="block mt-1 font-medium">
                ផលិតផលក្នុងស្តុក
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-0 rounded-2xl bg-white hover:shadow-md transition-all">
            <div className="flex justify-between items-center mb-4">
              <span className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <UsergroupAddOutlined className="text-2xl" />
              </span>
              <span className="text-green-600 text-sm font-semibold flex items-center bg-green-50 px-2 py-1 rounded-md">
                <ArrowUpOutlined className="mr-1" /> +5.6%
              </span>
            </div>
            <div>
              <AntTitle level={3} className="m-0 font-extrabold text-gray-900">
                852
              </AntTitle>
              <Text type="secondary" className="block mt-1 font-medium">
                អតិថិជនសរុប
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} className="mt-8">
        <Col xs={24} lg={16}>
          <Card className="shadow-sm border-0 rounded-2xl h-[420px] bg-white">
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 gap-3">
              <div>
                <AntTitle level={5} className="m-0 font-bold text-gray-800">
                  ទិដ្ឋភាពរួមនៃចំណូល (Revenue Overview)
                </AntTitle>
                <Text type="secondary" className="text-xs">
                  របាយការណ៍ប្រៀបធៀប ចំណូល និងការលក់ប្រចាំឆ្នាំ
                </Text>
              </div>

              <div>
                <Radio.Group
                  defaultValue="month"
                  buttonStyle="solid"
                  size="small"
                >
                  <Radio.Button value="day">ថ្ងៃ</Radio.Button>
                  <Radio.Button value="week">សប្តាហ៍</Radio.Button>
                  <Radio.Button value="month">ខែ</Radio.Button>
                </Radio.Group>
              </div>
            </div>

            <div className="h-[280px]">
              <Line data={lineData} options={lineOptions} />
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card className="shadow-sm border-0 rounded-2xl h-[420px] bg-white">
            <div className="flex justify-between items-center mb-6">
              <AntTitle level={5} className="m-0 font-bold text-gray-800">
                ប្រាក់ចំណេញសប្តាហ៍នេះ
              </AntTitle>
              <Select
                defaultValue="thisWeek"
                size="small"
                style={{ width: 120 }}
              >
                <Option value="thisWeek">សប្តាហ៍នេះ</Option>
                <Option value="lastWeek">សប្តាហ៍មុន</Option>
              </Select>
            </div>

            <div className="h-[280px]">
              <Bar data={barData} options={barOptions} />
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="mt-8">
        <Col span={24}>
          <Card className="shadow-sm border-0 rounded-2xl bg-white p-2">
            <AntTitle level={5} className="m-0 mb-4 font-bold text-gray-800">
              ទំនិញលក់ដាច់ជាងគេក្នុងខែនេះ (Top Products)
            </AntTitle>
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={false}
              loading={loading}
              rowClassName="hover:bg-gray-50 cursor-pointer"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;
