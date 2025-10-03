package com.license.management.system.models;

import lombok.*;
import javax.persistence.*;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;
    private String gpsCoordinates;
    private String email;
    private Double applicationFee;
    private Double licenseFee;
    private Double annualContribution;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
    private List<License> licenses;
}
