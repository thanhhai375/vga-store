import { Card, Row, Col } from "antd";

export default function Dashboard() {
    return (
        <>
            <Row gutter={16}>
                <Col span={6}><Card>Tổng doanh thu: 100M</Card></Col>
                <Col span={6}><Card>Đơn hàng: 50</Card></Col>
                <Col span={6}><Card>Khách hàng: 20</Card></Col>
                <Col span={6}><Card>Hết hàng: 5</Card></Col>
            </Row>

            <Card style={{ marginTop: 20 }}>
                📈 Biểu đồ (có thể thêm sau)
            </Card>
        </>
    );
}