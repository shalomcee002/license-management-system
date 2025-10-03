package com.license.management.system.controllers;

import com.license.management.system.services.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;

@RestController
@RequestMapping("/api/map")
public class MapController {
    @Autowired
    private CompanyService companyService;

    @GetMapping("/companies/locations")
    public List<Map<String, Object>> getCompanyLocations() {
        return companyService.getAllCompanies().stream()
            .map(company -> Map.<String, Object>of(
                "id", (Object) company.getId(),
                "name", (Object) company.getCompanyName(),
                "gpsCoordinates", (Object) company.getGpsCoordinates()
            ))
            .collect(Collectors.toList());
    }
}
