package com.masterglobal.erp.config;

import com.masterglobal.erp.entity.AppUser;
import com.masterglobal.erp.repository.AppUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initUsers(AppUserRepository userRepo) {
        return args -> {
            if (userRepo.findByUsername("admin").isEmpty()) {
                AppUser user = new AppUser();
                user.setUsername("admin");
                user.setPassword("admin123"); // demo only
                user.setRole("ADMIN");
                userRepo.save(user);

                System.out.println("✅ Default user created: admin / admin123");
            }
        };
    }
}
