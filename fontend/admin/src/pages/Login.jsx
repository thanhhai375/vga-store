import { Input, Button, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const nav = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await api.post("/admin/login", {
                email,
                password,
            });

            // lưu token
            localStorage.setItem("token", res.data.token);

            message.success("Đăng nhập thành công");
            nav("/");
        } catch (err) {
            console.log(err);
            message.error("Sai tài khoản");
        }
    };

    return (
        <div style={{ width: 300, margin: "100px auto" }}>
            <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <Input.Password
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ marginTop: 10 }}
            />

            <Button
                type="primary"
                block
                style={{ marginTop: 10 }}
                onClick={handleLogin}
            >
                Đăng nhập
            </Button>
        </div>
    );
}