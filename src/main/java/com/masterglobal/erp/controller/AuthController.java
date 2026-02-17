package com.masterglobal.erp.controller;

import com.masterglobal.erp.entity.AppUser;
import com.masterglobal.erp.repository.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AppUserRepository userRepo;

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> req) {
        String username = req.get("username");
        String password = req.get("password");

        AppUser user = userRepo.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password"));

        // ⚠️ Plain text check for now (for demo)
        if (!user.getPassword().equals(password)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password");
        }

        // Fake token (just to satisfy frontend)
        Map<String, String> res = new HashMap<>();
        res.put("token", "demo-token-" + user.getUsername());
        return res;
    }
}
