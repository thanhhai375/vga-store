package com.example.vgashop.controler;

import com.example.vgashop.entity.Blog;
import com.example.vgashop.repository.BlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {

    @Autowired
    private BlogRepository blogRepository;

    @GetMapping
    public ResponseEntity<List<Blog>> getAllBlogs() {
        // Sp xp theo th t u tin (displayOrder) sau  mi n ID
        return ResponseEntity.ok(blogRepository.findAll(Sort.by(Sort.Direction.ASC, "displayOrder").and(Sort.by(Sort.Direction.ASC, "id"))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Blog> getBlogById(@PathVariable Long id) {
        Blog blog = blogRepository.findById(id).orElse(null);
        if (blog != null) {
            blog.setViews(blog.getViews() + 1); // Increase view
            blogRepository.save(blog);
            return ResponseEntity.ok(blog);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/featured")
    public ResponseEntity<List<Blog>> getFeaturedBlogs() {
        return ResponseEntity.ok(blogRepository.findByFeaturedTrue());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Blog>> getBlogsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(blogRepository.findByCategory(category));
    }

    @GetMapping("/seed-fake")
    public ResponseEntity<String> seedFakeData() {
        try {
            List<Blog> blogs = blogRepository.findAll();
            String fakeContent = "[{\"type\":\"paragraph\",\"body\":\"Để kiểm chứng sức mạnh của hệ thống, chúng tôi đã đưa thiết bị vào các bài Test khắc nghiệt nhất. Từ Cyberpunk 2077 cho tới Alan Wake 2, mức FPS đổ ra đều hoàn toàn thuyết phục. Chữ mượt là không đủ để diễn tả, mà phải nói là hoàn mỹ, ngay cả ở độ phân giải 4K.\"},{\"type\":\"image\",\"url\":\"https:// images.unsplash.com/photo-1587202372775-9002220d575c?q=80&w=1200&auto=format&fit=crop\",\"caption\":\"Hiu nng ta sng khng t vt nh cc kin trc x l ray-tracing ti tn.\"},{\"type\":\"tip\",\"body\":\"Mo:  y mc FPS ln cao hn na, ng qun kch hot cc cng ngh mi nht trong ci t  ha ca Game!\"},{\"type\":\"heading\",\"body\":\"Nhit  v kh nng tn nhit\"},{\"type\":\"paragraph\",\"body\":\"Thit k Heatsink hm h i km h thng lm mt  gi nhit  n nh  ngng an ton tuyt i ngay c khi h thng chy full-load lin tc. Mt u im cc ln l  n  gim thiu ti a, mang li tri nghim m i.\"},{\"type\":\"heading\",\"body\":\"Cch ti u lung thng gi (Air-flow) cho h thng ca bn\"},{\"type\":\"steps\",\"items\":[{\"step\":1,\"title\":\"V sinh nh k\",\"desc\":\"Thng xuyn lau bi cho cc tm li lc  khng kh lu thng 100%.\"},{\"step\":2,\"title\":\"Sp xp dy cp\",\"desc\":\"Tht gn cp ngun  khng cn tr lung gi mt i t qut trc.\"},{\"step\":3,\"title\":\"Thit lp p sut\",\"desc\":\"C lng kh ht vo tng ng lng kh x ra ngoi  p sut lun cn bng (Neutral Pressure).\"}]},{\"type\":\"paragraph\",\"body\":\"Tng kt li, y qu thc l ni dung nh gi chn thc nht dnh cho bn.\"}]";
            
            for (Blog b : blogs) {
                b.setContent(fakeContent);
                blogRepository.save(b);
            }
            return ResponseEntity.ok("Seeded " + blogs.size() + " blogs.");
        } catch (Exception e) {
            return ResponseEntity.ok("ERROR THROWN: " + e.toString());
        }
    }
}
