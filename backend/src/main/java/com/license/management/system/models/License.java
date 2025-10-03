package com.license.management.system.models;


import javax.persistence.*;
import java.util.Date;
import lombok.Getter;
import lombok.Setter;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
public abstract class License {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String licenseID;
    private Date licenseIssueDate;
    private int validityPeriod;
    private Date expiryDate;
    private Double frequencyFee;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;
}
