package com.license.management.system.services;

import com.license.management.system.models.Role.RoleName;
import com.license.management.system.models.User;

import java.util.List;

public interface UserService {
    User createUser(String name, String email, String password, RoleName defaultRole);
    List<User> getAllUsers();
    User updateUserRoles(Long userId, List<RoleName> roles);
    void deleteUser(Long userId);
    User changePassword(Long userId, String currentPassword, String newPassword);
}