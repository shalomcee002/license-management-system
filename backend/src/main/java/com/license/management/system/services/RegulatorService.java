package com.license.management.system.services;

import com.license.management.system.models.CellularTelecomLicense;
import com.license.management.system.models.License;
import com.license.management.system.models.PublicRadioStationLicense;
import com.license.management.system.repositories.LicenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

@Service
public class RegulatorService {
    @Autowired
    private LicenseRepository licenseRepository;
    @Autowired
    private LicenseService licenseService;

    public void calculateAndSetExpiry(License license) {
        if (license instanceof CellularTelecomLicense) {
            // CTL validity: 15 years from issue date
            if (license.getLicenseIssueDate() != null) {
                LocalDate issue = license.getLicenseIssueDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                LocalDate expiry = issue.plusYears(15);
                license.setExpiryDate(Date.from(expiry.atStartOfDay(ZoneId.systemDefault()).toInstant()));
            }
        } else if (license instanceof PublicRadioStationLicense) {
            PublicRadioStationLicense prsl = (PublicRadioStationLicense) license;
            if (license.getLicenseIssueDate() != null && prsl.getValidityPeriodYears() != null) {
                LocalDate issue = license.getLicenseIssueDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                LocalDate expiry = issue.plusYears(prsl.getValidityPeriodYears());
                license.setExpiryDate(Date.from(expiry.atStartOfDay(ZoneId.systemDefault()).toInstant()));
            }
        }
    }

    public double adjustApplicationFee(double currentFee, double percent) {
        return Math.round(currentFee * (1 + percent / 100.0) * 100.0) / 100.0;
    }

    public boolean compareLicenses(License a, License b) {
        return licenseService.areLicensesEqual(a, b);
    }
} 