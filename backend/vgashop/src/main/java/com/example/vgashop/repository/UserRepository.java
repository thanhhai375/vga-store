package com.example.vgashop.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.vgashop.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface  UserRepository extends JpaRepository<User, Long>  {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    // Soft Delete
    Page<User> findByDeletedFalse(Pageable pageable);
    Optional<User> findByIdAndDeleted(Long id, boolean deleted);
    boolean existsByIdAndDeleted(Long id, boolean deleted);

    Optional<User> findByUsernameAndDeletedFalse(String username);

    // Tìm kiếm theo username hoặc email
    Page<User> findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(String username, String email, Pageable pageable);
}
