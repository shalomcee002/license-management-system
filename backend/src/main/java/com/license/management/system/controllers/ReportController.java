package com.license.management.system.controllers;

import com.license.management.system.services.ReportService;
import com.lowagie.text.DocumentException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/reports")
public class ReportController {
    @Autowired
    private ReportService reportService;

    @GetMapping("/companies/excel")
    public ResponseEntity<byte[]> exportCompaniesToExcel() {
        try {
            byte[] data = reportService.exportCompaniesToExcel();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "companies.csv");
            return ResponseEntity.ok().headers(headers).body(data);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/licenses")
    public ResponseEntity<byte[]> exportLicenses(@RequestParam(defaultValue = "csv") String format) {
        try {
            byte[] data = reportService.exportLicenses(format);
            HttpHeaders headers = new HttpHeaders();
            String filename;
            MediaType mt;
            switch (format.toLowerCase()) {
                case "xlsx":
                    filename = "licenses.xlsx";
                    mt = MediaType.APPLICATION_OCTET_STREAM;
                    break;
                case "pdf":
                    filename = "licenses.pdf";
                    mt = MediaType.APPLICATION_PDF;
                    break;
                case "csv":
                default:
                    filename = "licenses.csv";
                    mt = MediaType.TEXT_PLAIN;
            }
            headers.setContentType(mt);
            headers.setContentDispositionFormData("attachment", filename);
            return ResponseEntity.ok().headers(headers).body(data);
        } catch (IOException | DocumentException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
