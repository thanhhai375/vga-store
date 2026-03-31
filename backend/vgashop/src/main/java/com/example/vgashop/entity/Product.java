package com.example.vgashop.entity;

import java.math.BigDecimal;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "products")
public class Product extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "id")
    private Long id;

    @Column(name= "name", nullable= false, length= 255)
    private String name;

    @Column(name= "price", nullable= false)
    private BigDecimal price;

    @Column(name="stock", nullable=false)
    private Integer stock;

    @Column(unique = true, length = 50)
    private String sku;        // Mã sản phẩm duy nhất

    @Column(name= "description", columnDefinition= "TEXT")
    private String description;

    @Column(name= "img_url", length= 500)
    private String imgUrl;

    @ManyToOne(fetch= FetchType.EAGER)
    @JoinColumn(name= "brand_id", nullable= false)
    private Brand brand;

    @ManyToOne(fetch= FetchType.EAGER)
    @JoinColumn(name= "category_id", nullable= false)
    private Category category;

    @OneToMany(mappedBy= "product", fetch= FetchType.LAZY)
    private List<CartItem> cartItems;
    
    @OneToMany(mappedBy= "product", fetch= FetchType.LAZY)
    private List<OrderItem> orderItems;

    // Getter setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }

    public Brand getBrand() {
        return brand;
    }

    public void setBrand(Brand brand) {
        this.brand = brand;
    }

    public List<CartItem> getCartItems() {
        return cartItems;
    }

    public void setCartItems(List<CartItem> cartItems) {
        this.cartItems = cartItems;
    }

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }


    public Category getCategory() {
        return category;
    }
    
     public void setCategory(Category category) {
        this.category = category;
    }

     public String getSku() {
         return sku;
     }

     public void setSku(String sku) {
         this.sku = sku;
     }

}
