
package com.license.management.system.models;

import javax.persistence.*;


import lombok.*;


@Entity
@Table(name = "cellular_telecom_licenses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class CellularTelecomLicense extends License {
    private Double latitude;
    private Double longitude;
    private Double applicationFee;
    private Double licenseFee;
    private Integer validityPeriodMonths;
    private Double annualFrequencyFee;
    private Double annualUSFContribution;
}
