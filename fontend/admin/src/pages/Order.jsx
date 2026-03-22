import { Table, Select } from "antd";

export default function Order() {
    return (
        <>
            <Select style={{ width: 200 }}>
                <Select.Option value="pending">Chờ</Select.Option>
                <Select.Option value="done">Hoàn thành</Select.Option>
            </Select>

            <Table style={{ marginTop: 20 }} />
        </>
    );
}