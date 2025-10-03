package com.license.management.system.controllers;

import com.license.management.system.models.Company;
import com.license.management.system.services.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {
    @Autowired
    private CompanyService companyService;

    @GetMapping
    public List<Company> getAllCompanies() {
        return companyService.getAllCompanies();
    }

    @GetMapping("/count")
    public long getCompaniesCount() {
        return companyService.count();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Company> getCompanyById(@PathVariable Long id) {
        return companyService.getCompanyById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Company createCompany(@RequestBody Company company) {
        return companyService.saveCompany(company);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Company> updateCompany(@PathVariable Long id, @RequestBody Company company) {
        if (!companyService.getCompanyById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        company.setId(id);
        return ResponseEntity.ok(companyService.saveCompany(company));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCompany(@PathVariable Long id) {
        if (!companyService.getCompanyById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        companyService.deleteCompany(id);
        return ResponseEntity.noContent().build();
    }
}
