package com.license.management.system.services;

import com.license.management.system.models.License;
import com.license.management.system.repositories.LicenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class LicenseService {
    @Autowired
    private LicenseRepository licenseRepository;

    public List<License> getAllLicenses() {
        return licenseRepository.findAll();
    }

    public Optional<License> getLicenseById(Long id) {
        return licenseRepository.findById(id);
    }

    public License saveLicense(License license) {
        return licenseRepository.save(license);
    }

    public void deleteLicense(Long id) {
        licenseRepository.deleteById(id);
    }

    public long count() {
        return licenseRepository.count();
    }

    public long countExpiringWithinDays(int days) {
        LocalDate now = LocalDate.now();
        LocalDate threshold = now.plusDays(days);
        return licenseRepository.findAll().stream()
                .filter(l -> l.getExpiryDate() != null)
                .filter(l -> {
                    LocalDate expiry = Instant.ofEpochMilli(l.getExpiryDate().getTime()).atZone(ZoneId.systemDefault()).toLocalDate();
                    return !expiry.isBefore(now) && !expiry.isAfter(threshold);
                })
                .count();
    }

    public double yearsUntilExpiryFromNow(License license) {
        if (license.getExpiryDate() == null) return 0;
        LocalDate now = LocalDate.now();
        LocalDate expiry = Instant.ofEpochMilli(license.getExpiryDate().getTime()).atZone(ZoneId.systemDefault()).toLocalDate();
        if (expiry.isBefore(now)) return 0;
        long days = ChronoUnit.DAYS.between(now, expiry);
        return Math.round((days / 365.25d) * 100.0) / 100.0;
    }

    public String getExpiryDateString(License license) {
        if (license.getExpiryDate() == null) return null;
        LocalDate expiry = Instant.ofEpochMilli(license.getExpiryDate().getTime()).atZone(ZoneId.systemDefault()).toLocalDate();
        return expiry.toString();
    }

    public int yearsUntilExpiry(License license) {
        if (license.getExpiryDate() == null || license.getLicenseIssueDate() == null) return 0;
        long millis = license.getExpiryDate().getTime() - license.getLicenseIssueDate().getTime();
        return (int) (millis / (1000L * 60 * 60 * 24 * 365));
    }

    public boolean areLicensesEqual(License l1, License l2) {
        return l1 != null && l2 != null &&
                nullSafeEquals(l1.getLicenseID(), l2.getLicenseID()) &&
                nullSafeEquals(l1.getLicenseIssueDate(), l2.getLicenseIssueDate()) &&
                l1.getValidityPeriod() == l2.getValidityPeriod() &&
                nullSafeEquals(l1.getExpiryDate(), l2.getExpiryDate()) &&
                nullSafeEquals(l1.getFrequencyFee(), l2.getFrequencyFee()) &&
                ((l1.getCompany() == null && l2.getCompany() == null) ||
                        (l1.getCompany() != null && l2.getCompany() != null && l1.getCompany().getId().equals(l2.getCompany().getId())));
    }

    private boolean nullSafeEquals(Object a, Object b) {
        if (a == null && b == null) return true;
        if (a == null || b == null) return false;
        return a.equals(b);
    }
}
