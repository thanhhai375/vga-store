package com.example.vgashop.config;

import com.example.vgashop.entity.*;
import com.example.vgashop.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import java.math.BigDecimal;
import java.util.Date;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            BrandRepository brandRepository,
            BlogRepository blogRepository,
            ReviewRepository reviewRepository,
            ServicePolicyRepository servicePolicyRepository,
            SystemSettingRepository systemSettingRepository,
            JdbcTemplate jdbcTemplate) {

        return args -> {

            // KHÔNG xóa reviews - đây là dữ liệu thực của người dùng!

            // SỬA LỖI ĐÁNH GIÁ (GỠ KHÓA NOT NULL CHO USER_ID)
            try {
                jdbcTemplate.execute("ALTER TABLE reviews ALTER COLUMN user_id DROP NOT NULL");
            } catch (Exception e) {
                System.out.println("Cột user_id trong reviews đã cho phép Null hoặc CSDL không hỗ trợ lệnh này.");
            }

            // Seed Settings
            if (systemSettingRepository.count() == 0) {
                systemSettingRepository.save(SystemSetting.builder().settingKey("BANK_ID").settingValue("970436").description("Mã BIN Ngân hàng (Vietcombank)").build());
                systemSettingRepository.save(SystemSetting.builder().settingKey("BANK_ACC_NO").settingValue("1234567890").description("Số tài khoản").build());
                systemSettingRepository.save(SystemSetting.builder().settingKey("BANK_ACC_NAME").settingValue("CONG TY VGA STORE").description("Tên chủ tài khoản").build());
            }

            // ── CHỈ SEED nếu bảng TRỐNG ─────────────────────────────────────
            if (blogRepository.count() == 0) {
                Blog b1 = new Blog();
                b1.setTitle("Lo Dien Dong Card AMD Radeon RX 8000 Series Sap Ra Mat");
                b1.setExcerpt("Theo thong tin ro ri, dong GPU RDNA 4 cua AMD se tap trung vao phan khuc tam trung, mang lai hieu nang vuot troi voi muc gia hop ly.");
                b1.setThumbnail("/images/blog/amd-rx8000.jpg");
                b1.setCategory("Tin cong nghe");
                b1.setAuthor("Admin");
                b1.setViews(120);
                b1.setFeatured(true);
                b1.setPublishedDate(new Date());
                b1.setContent("[" +
                    "{\"type\":\"Heading\",\"body\":\"AMD Sap Ra Mat RDNA 4\"}," +
                    "{\"type\":\"Paragraph\",\"body\":\"AMD da chinh thuc xac nhan se ra mat dong Radeon RX 8000 series moi vao cuoi nam nay. Day la the he GPU thu 4 cua AMD duoc xay dung tren kien truc RDNA 4 hoan toan moi.\"}," +
                    "{\"type\":\"Heading\",\"body\":\"Hieu Nang Du Doan\"}," +
                    "{\"type\":\"Paragraph\",\"body\":\"Theo cac bai ro ri, RX 8000 series se mang lai hieu nang tang 40-60% so voi the he RX 7000 trong khi giu nguyen muc gia hoac tham chi re hon.\"}," +
                    "{\"type\":\"tip\",\"body\":\"Neu ban dang dinh mua card do hoa moi, hay cho them vai thang de xem xet chon RX 8000 se mang lai gia tri tot hon.\"}," +
                    "{\"type\":\"Heading\",\"body\":\"Thoi Gian Ra Mat Du Kien\"}," +
                    "{\"type\":\"Paragraph\",\"body\":\"AMD du kien se chinh thuc gioi thieu dong RX 8000 tai su kien Computex 2025, voi gia ban du kien tu 8 trieu VND cho mau cap trung.\"}" +
                    "]");
                blogRepository.save(b1);

                Blog b2 = new Blog();
                b2.setTitle("Huong Dan Ve Sinh Card Do Hoa An Toan Tai Nha");
                b2.setExcerpt("Ve sinh VGA dinh ky giup tang tuoi tho va giam nhiet do hoat dong, duy tri hieu nang on dinh cho card do hoa cua ban.");
                b2.setThumbnail("/images/blog/vesinh.jpg");
                b2.setCategory("Huong dan");
                b2.setAuthor("Ky thuat vien");
                b2.setViews(250);
                b2.setFeatured(false);
                b2.setPublishedDate(new Date());
                b2.setContent("[" +
                    "{\"type\":\"Heading\",\"body\":\"Dung Cu Can Chuan Bi\"}," +
                    "{\"type\":\"Paragraph\",\"body\":\"Truoc khi ve sinh card do hoa, ban can chuan bi: binh khi nen, co mem, kem tan nhiet, tua vit 4 chau, khan sach.\"}," +
                    "{\"type\":\"Heading\",\"body\":\"Cac Buoc Ve Sinh Chi Tiet\"}," +
                    "{\"type\":\"steps\",\"items\":[" +
                    "{\"step\":1,\"title\":\"Thao Card khoi may tinh\",\"desc\":\"Tat nguon, rut het day, dung tua vit mo nap thung va nhe nhang thao card ra.\"}," +
                    "{\"step\":2,\"title\":\"Xit khi nen vao canh quat\",\"desc\":\"Giu canh quat co dinh bang tay, xit khi nen manh de thoi bay bui ban.\"}," +
                    "{\"step\":3,\"title\":\"Lap kem tan nhiet moi\",\"desc\":\"Dung co sach lau sach kem cu, boi kem tan nhiet moi len chip GPU.\"}," +
                    "{\"step\":4,\"title\":\"Lap lai va kiem tra\",\"desc\":\"Lap card tro lai may, bat may va kiem tra nhiet do xem co giam khong.\"}" +
                    "]}," +
                    "{\"type\":\"tip\",\"body\":\"Nen ve sinh card do hoa moi 6 thang 1 lan, dac biet neu ban song o moi truong nhieu bui.\"}" +
                    "]");
                blogRepository.save(b2);

                Blog b3 = new Blog();
                b3.setTitle("So Sanh RTX 4070 Super vs RX 7800 XT: Chon Card Nao Cho Game Thu Viet?");
                b3.setExcerpt("RTX 4070 Super va RX 7800 XT la 2 lua chon hang dau trong tam gia 15-18 trieu. Xem so sanh de biet chon card nao phu hop.");
                b3.setThumbnail("/images/blog/compare.jpg");
                b3.setCategory("Danh gia");
                b3.setAuthor("Gaming Expert");
                b3.setViews(480);
                b3.setFeatured(true);
                b3.setPublishedDate(new Date());
                b3.setContent("[" +
                    "{\"type\":\"Heading\",\"body\":\"Tong Quan Hai Doi Thu\"}," +
                    "{\"type\":\"Paragraph\",\"body\":\"RTX 4070 Super co muc gia 16.5 trieu, trong khi RX 7800 XT duoc ban quanh muc 15.9 trieu. Ca hai deu la lua chon chat luong o phan khuc tam cao.\"}," +
                    "{\"type\":\"Heading\",\"body\":\"Ket Luan\"}," +
                    "{\"type\":\"Paragraph\",\"body\":\"Neu uu tien DLSS 4 va ray tracing, chon RTX 4070 Super. Neu uu tien do phan giai RAM ve gia tri, chon RX 7800 XT.\"}" +
                    "]");
                blogRepository.save(b3);
            }

        };
    }
}
