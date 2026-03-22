import { Table, Button, Input, Modal, Form } from "antd";
import { useState } from "react";

export default function Product() {
    const [data, setData] = useState([
        { key: 1, name: "RTX 3060", brand: "ASUS", price: 1000, stock: 10 }
    ]);

    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();

    const handleAdd = () => {
        form.validateFields().then((values) => {
            setData([...data, { key: Date.now(), ...values }]);
            setOpen(false);
            form.resetFields();
        });
    };

    const handleDelete = (key) => {
        Modal.confirm({
            title: "Bạn chắc chắn xóa?",
            onOk: () => setData(data.filter((item) => item.key !== key))
        });
    };

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Input placeholder="Tìm VGA..." style={{ width: 200 }} />
                <Button type="primary" onClick={() => setOpen(true)}>+ Thêm</Button>
            </div>

            <Table
                style={{ marginTop: 20 }}
                dataSource={data}
                columns={[
                    { title: "Tên", dataIndex: "name" },
                    { title: "Hãng", dataIndex: "brand" },
                    { title: "Giá", dataIndex: "price" },
                    { title: "Kho", dataIndex: "stock" },
                    {
                        title: "Action",
                        render: (_, record) => (
                            <Button danger onClick={() => handleDelete(record.key)}>Xóa</Button>
                        )
                    }
                ]}
            />

            <Modal open={open} onOk={handleAdd} onCancel={() => setOpen(false)}>
                <Form form={form}>
                    <Form.Item name="name" label="Tên VGA" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="brand" label="Hãng">
                        <Input />
                    </Form.Item>
                    <Form.Item name="price" label="Giá">
                        <Input />
                    </Form.Item>
                    <Form.Item name="stock" label="Kho">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}