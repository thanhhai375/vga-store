package com.example.vgashop.dto;

import java.math.BigDecimal;


// Dùng để admin quản lý sản phẩm, có thể bao gồm thông tin như số lượng sản phẩm, danh sách sản phẩm, v.v.
public class ProductAdminResponse {

    private Long productId; // ID sản phẩm
    private String name; // Tên sản phẩm
    private BigDecimal price; // Giá sản phẩm
    private Integer stock; // Số lượng tồn kho
    private String brandName; // Tên thương hiệu
    private String categoryName; // Tên danh mục
    private Boolean status; // Trạng thái sản phẩm (active/inactive)
    private String imgUrl; // URL hình ảnh sản phẩm

    public ProductAdminResponse(Long productId, String name, BigDecimal price, Integer stock, String brandName,
            String categoryName, Boolean status, String imgUrl) {
        this.productId = productId;
        this.name = name;
        this.price = price;
        this.stock = stock;
        this.brandName = brandName;
        this.categoryName = categoryName;
        this.status = status;
        this.imgUrl = imgUrl;
    }



    // constructor
    public ProductAdminResponse() {}

    

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getBrandName() {
        return brandName;
    }

    public void setBrandName(String brandName) {
        this.brandName = brandName;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }

    // getters and setters
    
    
}
