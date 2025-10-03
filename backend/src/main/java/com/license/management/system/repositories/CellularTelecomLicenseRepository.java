package com.license.management.system.repositories;

import com.license.management.system.models.CellularTelecomLicense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CellularTelecomLicenseRepository extends JpaRepository<CellularTelecomLicense, Long> {
} 