package com.license.management.system.repositories;

import com.license.management.system.models.PublicRadioStationLicense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PublicRadioStationLicenseRepository extends JpaRepository<PublicRadioStationLicense, Long> {
} 