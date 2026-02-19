package com.masterglobal.erp.config;

import com.masterglobal.erp.entity.AppUser;
import com.masterglobal.erp.repository.AppUserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initUsers(AppUserRepository userRepo, PasswordEncoder encoder) {
        return args -> {
            if (userRepo.findByUsername("admin").isEmpty()) {
                AppUser user = new AppUser();
                user.setUsername("admin");
                user.setPassword(encoder.encode("admin123")); // ✅ BCrypt encoded
                user.setRole("ADMIN");
                userRepo.save(user);

                System.out.println("✅ Default user created: admin / admin123");
            }
        };
    }
}
