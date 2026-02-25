package com.masterglobal.erp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private GmailApiService gmailApiService;

    public void sendCustomerWelcomeMail(String toEmail, String customerName) {
        String subject = "Customer Created - MasterGlobal ERP";
        String body =
                "Dear " + customerName + ",\n\n" +
                        "Your customer profile has been successfully created.\n\n" +
                        "Regards,\nMasterGlobal Logistics";

        gmailApiService.sendEmail(toEmail, subject, body);
    }

    public void sendOtpMail(String toEmail, String otp) {
        String subject = "Your OTP - MasterGlobal ERP";
        String body =
                "Your OTP is: " + otp + "\n\n" +
                        "This OTP is valid for 5 minutes.\n\n" +
                        "Regards,\nMasterGlobal Logistics";

        gmailApiService.sendEmail(toEmail, subject, body);
    }
}