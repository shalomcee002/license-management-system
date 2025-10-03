package com.license.management.system.controllers;

import com.license.management.system.models.CellularTelecomLicense;
import com.license.management.system.models.License;
import com.license.management.system.models.PublicRadioStationLicense;
import com.license.management.system.services.LicenseService;
import com.license.management.system.services.RegulatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/licenses")
public class LicenseController {
    @Autowired
    private LicenseService licenseService;
    @Autowired
    private RegulatorService regulatorService;

    @GetMapping
    public List<License> getAllLicenses() {
        return licenseService.getAllLicenses();
    }

    @GetMapping("/count")
    public long getLicensesCount() {
        return licenseService.count();
    }

    @GetMapping("/types/count")
    public Map<String, Long> getTypeCounts() {
        long ctl = licenseService.getAllLicenses().stream().filter(l -> l instanceof CellularTelecomLicense).count();
        long prsl = licenseService.getAllLicenses().stream().filter(l -> l instanceof PublicRadioStationLicense).count();
        Map<String, Long> m = new HashMap<>();
        m.put("CTL", ctl);
        m.put("PRSL", prsl);
        return m;
    }

    @GetMapping("/expiring-soon/count")
    public long getExpiringSoonCount(@RequestParam(name = "days", defaultValue = "90") int days) {
        return licenseService.countExpiringWithinDays(days);
    }

    @GetMapping("/{id}")
    public ResponseEntity<License> getLicenseById(@PathVariable Long id) {
        return licenseService.getLicenseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/years-to-expiry")
    public ResponseEntity<Map<String, Object>> yearsToExpiry(@PathVariable Long id) {
        return licenseService.getLicenseById(id)
                .map(lic -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("expiryDate", licenseService.getExpiryDateString(lic));
                    map.put("yearsToExpiry", licenseService.yearsUntilExpiryFromNow(lic));
                    return ResponseEntity.ok(map);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/compare")
    public ResponseEntity<Map<String, Object>> compare(@RequestBody Map<String, String> body) {
        try {
            Long idA = Long.valueOf(body.get("a"));
            Long idB = Long.valueOf(body.get("b"));
            License a = licenseService.getLicenseById(idA).orElse(null);
            License b = licenseService.getLicenseById(idB).orElse(null);
            boolean equal = licenseService.areLicensesEqual(a, b);
            Map<String, Object> map = new HashMap<>();
            map.put("equal", equal);
            return ResponseEntity.ok(map);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public License createLicense(@RequestBody License license) {
        regulatorService.calculateAndSetExpiry(license);
        return licenseService.saveLicense(license);
    }

    @PutMapping("/{id}")
    public ResponseEntity<License> updateLicense(@PathVariable Long id, @RequestBody License license) {
        if (!licenseService.getLicenseById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        license.setId(id);
        regulatorService.calculateAndSetExpiry(license);
        return ResponseEntity.ok(licenseService.saveLicense(license));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLicense(@PathVariable Long id) {
        if (!licenseService.getLicenseById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        licenseService.deleteLicense(id);
        return ResponseEntity.noContent().build();
    }
}
