package com.license.management.system.services;

import com.license.management.system.models.Company;
import com.license.management.system.models.License;
import com.license.management.system.repositories.LicenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private LicenseRepository licenseRepository;

    // Runs daily at 8am
    @Scheduled(cron = "0 0 8 * * ?")
    public void sendExpiryNotifications() {
        Date now = new Date();
        List<License> licenses = licenseRepository.findAll();
        for (License license : licenses) {
            if (license.getExpiryDate() != null &&
                (license.getExpiryDate().getTime() - now.getTime()) < 1000L * 60 * 60 * 24 * 30) { // expires in 30 days
                Company company = license.getCompany();
                if (company != null && company.getEmail() != null) {
                    sendEmail(company.getEmail(),
                        "License Expiry Notification",
                        "Dear " + company.getCompanyName() + ", your license (ID: " + license.getLicenseID() + ") will expire on " + license.getExpiryDate() + ". Please renew soon.");
                }
            }
        }
    }

    public void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }
}
