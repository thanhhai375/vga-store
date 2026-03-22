import { Input, Button } from "antd";

export default function Login() {
    return (
        <div style={{ width: 300, margin: "100px auto" }}>
            <Input placeholder="Email" />
            <Input.Password placeholder="Password" style={{ marginTop: 10 }} />
            <Button type="primary" block style={{ marginTop: 10 }}>
                Đăng nhập
            </Button>
        </div>
    );
}