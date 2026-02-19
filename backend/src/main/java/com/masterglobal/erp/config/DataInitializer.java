package com.masterglobal.erp.config;

import com.masterglobal.erp.entity.AppUser;
import com.masterglobal.erp.repository.AppUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initUsers(AppUserRepository userRepo, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepo.findByUsername("admin").isEmpty()) {
                AppUser user = new AppUser();
                user.setUsername("admin");
                user.setPassword(passwordEncoder.encode("admin123")); // ✅ ENCODED
                user.setRole("ADMIN");
                userRepo.save(user);

                System.out.println("✅ Default user created: admin / admin123");
            }
        };
    }
}
