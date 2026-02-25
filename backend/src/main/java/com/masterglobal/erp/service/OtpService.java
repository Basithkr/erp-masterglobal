package com.masterglobal.erp.service;

import com.masterglobal.erp.entity.EmailOtp;
import com.masterglobal.erp.repository.EmailOtpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private EmailOtpRepository repo;

    @Autowired
    private EmailService emailService;

    public void sendOtp(String email) {
        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        EmailOtp e = new EmailOtp();
        e.setEmail(email);
        e.setOtp(otp);
        e.setVerified(false);
        e.setExpiresAt(LocalDateTime.now().plusMinutes(5));

        repo.save(e);

        emailService.sendOtpMail(email, otp);
    }

    public void verifyOtp(String email, String otp) {
        EmailOtp e = repo.findTopByEmailOrderByIdDesc(email)
                .orElseThrow(() -> new RuntimeException("OTP not found"));

        if (e.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        if (!e.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        e.setVerified(true);
        repo.save(e);
    }

    public boolean isEmailVerified(String email) {
        return repo.findTopByEmailOrderByIdDesc(email)
                .map(EmailOtp::isVerified)
                .orElse(false);
    }
}