package com.license.management.system.config;

import com.license.management.system.models.Role;
import com.license.management.system.models.User;
import com.license.management.system.repositories.RoleRepository;
import com.license.management.system.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.HashSet;
import java.util.Set;

@Configuration
public class DataInitializer implements CommandLineRunner {
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        Role.RoleName[] roles = new Role.RoleName[]{ Role.RoleName.ROLE_ADMIN, Role.RoleName.ROLE_OFFICER, Role.RoleName.ROLE_VIEWER };
        for (Role.RoleName rn : roles) {
            roleRepository.findByName(rn).orElseGet(() -> roleRepository.save(new Role(null, rn)));
        }
        if (!userRepository.existsByEmail("admin@example.com")) {
            Role adminRole = roleRepository.findByName(Role.RoleName.ROLE_ADMIN).get();
            Set<Role> r = new HashSet<>();
            r.add(adminRole);
            User admin = new User(null, "Administrator", "admin@example.com", "{noop}password", r);
            userRepository.save(admin);
        }
    }
} 