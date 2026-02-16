package com.masterglobal.erp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendCustomerWelcomeMail(String toEmail, String customerName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Customer Created - MasterGlobal ERP");
        message.setText(
                "Dear " + customerName + ",\n\n" +
                        "Your customer profile has been successfully created.\n\n" +
                        "Regards,\nMasterGlobal Logistics"
        );

        mailSender.send(message);
    }
}
