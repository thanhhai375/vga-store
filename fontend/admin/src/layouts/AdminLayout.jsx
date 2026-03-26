import { Layout, Menu, Button } from "antd";
import { Outlet, useNavigate } from "react-router-dom";

const { Sider, Header, Content } = Layout;

export default function AdminLayout() {
    const nav = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        nav("/login");
    };

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
                <Header style={{ background: "#fff", display: "flex", justifyContent: "space-between" }}>
                    <div>🔍 Search | 🔔 | Admin</div>
                    <Button danger onClick={handleLogout}>Đăng xuất</Button>
                </Header>

                <Content style={{ margin: 16 }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}