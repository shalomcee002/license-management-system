package com.license.management.system.controllers;

import com.license.management.system.models.License;
import com.license.management.system.models.Notification;
import com.license.management.system.repositories.NotificationRepository;
import com.license.management.system.services.LicenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private LicenseService licenseService;
    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping
    public List<Notification> list() {
        return notificationRepository.findAll();
    }

    @PostMapping("/expiring")
    public ResponseEntity<Void> notifyExpiring(@RequestBody Map<String, Object> body) {
        int days = Integer.parseInt(String.valueOf(body.getOrDefault("days", 90)));
        LocalDate now = LocalDate.now();
        LocalDate threshold = now.plusDays(days);
        for (License lic : licenseService.getAllLicenses()) {
            if (lic.getExpiryDate() == null || lic.getCompany() == null || lic.getCompany().getEmail() == null) continue;
            LocalDate expiry = Instant.ofEpochMilli(lic.getExpiryDate().getTime()).atZone(ZoneId.systemDefault()).toLocalDate();
            if (!expiry.isBefore(now) && !expiry.isAfter(threshold)) {
                String msg = "Your license " + lic.getLicenseID() + " is expiring on " + lic.getExpiryDate();
                sendEmail(lic.getCompany().getEmail(), msg);
                Notification n = new Notification(null, lic, msg, new Date());
                notificationRepository.save(n);
            }
        }
        return ResponseEntity.ok().build();
    }

    private void sendEmail(String to, String messageText) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("License Expiry Notice");
            message.setText(messageText);
            mailSender.send(message);
        } catch (Exception ignored) {}
    }
} 