package com.license.management.system.models;

import javax.persistence.Entity;
import javax.persistence.Table;
import lombok.*;

@Entity
@Table(name = "public_radio_station_licenses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class PublicRadioStationLicense extends License {
    private Double applicationFee;
    private Double licenseFee;
    private Integer validityPeriodYears;
    private Double annualFrequencyFee;
}
