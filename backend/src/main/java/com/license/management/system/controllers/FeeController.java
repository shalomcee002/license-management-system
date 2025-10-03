package com.license.management.system.controllers;

import com.license.management.system.models.Company;
import com.license.management.system.models.License;
import com.license.management.system.repositories.CompanyRepository;
import com.license.management.system.repositories.LicenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fees")
public class FeeController {
    @Autowired
    private CompanyRepository companyRepository;
    @Autowired
    private LicenseRepository licenseRepository;

    @PostMapping("/adjust")
    public ResponseEntity<Void> adjustFees(@RequestBody Map<String, Object> body) {
        String licenseType = String.valueOf(body.get("licenseType"));
        double percent = Double.parseDouble(String.valueOf(body.get("percent")));
        double factor = 1 + (percent / 100.0);
        // Adjust application fees at company level based on license type rule
        List<Company> companies = companyRepository.findAll();
        for (Company c : companies) {
            boolean hasType = c.getLicenses() != null && c.getLicenses().stream().anyMatch(l -> matchesType(l, licenseType));
            if (hasType && c.getApplicationFee() != null) {
                c.setApplicationFee(round2(c.getApplicationFee() * factor));
            }
        }
        companyRepository.saveAll(companies);
        return ResponseEntity.ok().build();
    }

    private boolean matchesType(License l, String licenseType) {
        if (licenseType == null) return true;
        if ("CTL".equalsIgnoreCase(licenseType)) {
            return l.getClass().getSimpleName().toUpperCase().contains("CELLULAR") || l.getFrequencyFee() == null;
        }
        if ("PRSL".equalsIgnoreCase(licenseType)) {
            return l.getFrequencyFee() != null; // PRSL has annual frequency fee according to problem statement
        }
        return true;
    }

    private double round2(double v) {
        return Math.round(v * 100.0) / 100.0;
    }
} 