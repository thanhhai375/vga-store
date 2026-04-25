package com.example.vgashop.dto;

import java.math.BigDecimal;


// Dng  admin qun l sn phm, c th bao gm thng tin nh s lng sn phm, danh sch sn phm, v.v.
public class ProductAdminResponse {

    private Long productId; // ID sn phm
    private String name; // Tn sn phm
    private BigDecimal price; // Gi sn phm
    private Integer stock; // S lng tn kho
    private String brandName; // Tn thng hiu
    private String categoryName; // Tn danh mc
    private Boolean status; // Trng thi sn phm (active/inactive)
    private String imgUrl; // URL hnh nh sn phm

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
