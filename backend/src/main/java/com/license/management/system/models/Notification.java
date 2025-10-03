package com.license.management.system.models;

import javax.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "license_id")
    private License license;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Temporal(TemporalType.TIMESTAMP)
    private Date sentAt;
} 