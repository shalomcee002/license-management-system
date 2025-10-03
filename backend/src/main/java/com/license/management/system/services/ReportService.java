package com.license.management.system.services;

import com.license.management.system.models.Company;
import com.license.management.system.models.License;
import com.license.management.system.repositories.CompanyRepository;
import com.license.management.system.repositories.LicenseRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {
    @Autowired
    private CompanyRepository companyRepository;
    @Autowired
    private LicenseRepository licenseRepository;

    public byte[] exportCompaniesToExcel() {
        List<Company> companies = companyRepository.findAll();
        String header = "id,companyName,email,gpsCoordinates,applicationFee,licenseFee,annualContribution";
        String rows = companies.stream().map(c -> String.join(",",
                toStr(c.getId()),
                safe(c.getCompanyName()),
                safe(c.getEmail()),
                safe(c.getGpsCoordinates()),
                toStr(c.getApplicationFee()),
                toStr(c.getLicenseFee()),
                toStr(c.getAnnualContribution())
        )).collect(Collectors.joining("\n"));
        String csv = header + "\n" + rows;
        return csv.getBytes(StandardCharsets.UTF_8);
    }

    public byte[] exportLicenses(String format) throws IOException, DocumentException {
        List<License> licenses = licenseRepository.findAll();
        switch (format == null ? "csv" : format.toLowerCase()) {
            case "xlsx":
                return toExcel(licenses);
            case "pdf":
                return toPdf(licenses);
            case "csv":
            default:
                return toCsv(licenses);
        }
    }

    private byte[] toCsv(List<License> licenses) {
        String header = "id,licenseID,company,issueDate,expiryDate,validityYears,frequencyFee";
        String rows = licenses.stream().map(l -> String.join(",",
                toStr(l.getId()),
                safe(l.getLicenseID()),
                safe(l.getCompany() != null ? l.getCompany().getCompanyName() : null),
                toStr(l.getLicenseIssueDate()),
                toStr(l.getExpiryDate()),
                toStr(l.getValidityPeriod()),
                toStr(l.getFrequencyFee())
        )).collect(Collectors.joining("\n"));
        String csv = header + "\n" + rows;
        return csv.getBytes(StandardCharsets.UTF_8);
    }

    private byte[] toExcel(List<License> licenses) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Licenses");
            Row header = sheet.createRow(0);
            String[] cols = {"ID","LicenseID","Company","IssueDate","ExpiryDate","ValidityYears","FrequencyFee"};
            for (int i = 0; i < cols.length; i++) header.createCell(i).setCellValue(cols[i]);
            int rowIdx = 1;
            for (License l : licenses) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(toStr(l.getId()));
                row.createCell(1).setCellValue(safe(l.getLicenseID()));
                row.createCell(2).setCellValue(safe(l.getCompany() != null ? l.getCompany().getCompanyName() : null));
                row.createCell(3).setCellValue(toStr(l.getLicenseIssueDate()));
                row.createCell(4).setCellValue(toStr(l.getExpiryDate()));
                row.createCell(5).setCellValue(toStr(l.getValidityPeriod()));
                row.createCell(6).setCellValue(toStr(l.getFrequencyFee()));
            }
            for (int i = 0; i < 7; i++) sheet.autoSizeColumn(i);
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        }
    }

    private byte[] toPdf(List<License> licenses) throws DocumentException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document doc = new Document();
        PdfWriter.getInstance(doc, out);
        doc.open();
        doc.add(new Paragraph("Licenses Report"));
        doc.add(new Paragraph("\n"));
        for (License l : licenses) {
            doc.add(new Paragraph(String.format("%s | %s | %s | %s",
                    toStr(l.getId()), safe(l.getLicenseID()),
                    safe(l.getCompany() != null ? l.getCompany().getCompanyName() : null),
                    toStr(l.getExpiryDate()))));
        }
        doc.close();
        return out.toByteArray();
    }

    private String toStr(Object o) { return o == null ? "" : String.valueOf(o); }
    private String safe(String s) { return s == null ? "" : s.replace(",", " "); }
}
