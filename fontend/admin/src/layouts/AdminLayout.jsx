import { Layout, Menu } from "antd";
import { Outlet, useNavigate } from "react-router-dom";

const { Sider, Header, Content } = Layout;

export default function AdminLayout() {
    const nav = useNavigate();

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider>
                <Menu theme="dark" onClick={(e) => nav(e.key)}>
                    <Menu.Item key="/">Dashboard</Menu.Item>
                    <Menu.Item key="/product">Sản phẩm</Menu.Item>
                    <Menu.Item key="/order">Đơn hàng</Menu.Item>
                    <Menu.Item key="/user">Khách hàng</Menu.Item>
                </Menu>
            </Sider>

            <Layout>
                <Header style={{ background: "#fff" }}>
                    🔍 Search | 🔔 | Admin
                </Header>

                <Content style={{ margin: 16 }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}