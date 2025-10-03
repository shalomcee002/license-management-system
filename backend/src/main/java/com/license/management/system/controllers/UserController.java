package com.license.management.system.controllers;

import com.license.management.system.models.Role.RoleName;
import com.license.management.system.models.User;
import com.license.management.system.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    /**
     * Get all users - only accessible by ADMIN
     */
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<Map<String, Object>> userDtos = users.stream()
                .map(user -> Map.of(
                        "id", user.getId(),
                        "name", user.getName(),
                        "email", user.getEmail(),
                        "roles", user.getRoles().stream().map(r -> r.getName().name()).collect(Collectors.toList())
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(userDtos);
    }

    /**
     * Update user roles - only accessible by ADMIN
     */
    @PutMapping("/{userId}/roles")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateUserRoles(@PathVariable Long userId, @RequestBody Map<String, List<String>> body) {
        try {
            List<String> roleStrings = body.get("roles");
            if (roleStrings == null || roleStrings.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "At least one role must be specified"));
            }
            
            List<RoleName> roleNames = roleStrings.stream()
                    .map(RoleName::valueOf)
                    .collect(Collectors.toList());
            
            User updatedUser = userService.updateUserRoles(userId, roleNames);
            
            return ResponseEntity.ok(Map.of(
                    "id", updatedUser.getId(),
                    "name", updatedUser.getName(),
                    "email", updatedUser.getEmail(),
                    "roles", updatedUser.getRoles().stream().map(r -> r.getName().name()).collect(Collectors.toList())
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid role name"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Delete a user - only accessible by ADMIN
     */
    @DeleteMapping("/{userId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        try {
            userService.deleteUser(userId);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}