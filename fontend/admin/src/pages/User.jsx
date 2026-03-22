import { Table, Button } from "antd";

export default function User() {
    return (
        <Table
            columns={[
                { title: "Tên", dataIndex: "name" },
                { title: "Email", dataIndex: "email" },
                {
                    title: "Action",
                    render: () => <Button danger>Khóa</Button>
                }
            ]}
            dataSource={[
                { key: 1, name: "Nguyễn Văn A", email: "a@gmail.com" }
            ]}
        />
    );
}