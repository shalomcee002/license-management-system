package com.license.management.system.controllers;

import com.license.management.system.models.Role;
import com.license.management.system.models.Role.RoleName;
import com.license.management.system.models.User;
import com.license.management.system.repositories.UserRepository;
import com.license.management.system.security.JwtUtil;
import com.license.management.system.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserService userService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        return userRepository.findByEmail(email)
                .filter(u -> passwordEncoder.matches(password, u.getPassword()))
                .map(u -> {
                    var roles = u.getRoles() == null ? java.util.List.<String>of() : u.getRoles().stream().map(r -> r.getName().name()).collect(Collectors.toList());
                    Map<String, Object> claims = new HashMap<>();
                    claims.put("roles", roles);
                    String token = jwtUtil.generateToken(u.getEmail(), claims);
                    Map<String, Object> resp = new HashMap<>();
                    resp.put("token", token);
                    resp.put("roles", roles);
                    resp.put("user", Map.of("id", u.getId(), "name", u.getName(), "email", u.getEmail()));
                    return ResponseEntity.ok(resp);
                })
                .orElse(ResponseEntity.status(401).build());
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> me(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return ResponseEntity.status(401).build();
        String token = authHeader.substring(7);
        if (!jwtUtil.validate(token)) return ResponseEntity.status(401).build();
        var claims = jwtUtil.getClaims(token);
        var email = claims.getSubject();
        return userRepository.findByEmail(email)
                .map(u -> ResponseEntity.ok(Map.of(
                        "email", email,
                        "roles", u.getRoles().stream().map(r -> r.getName().name()).collect(Collectors.toList())
                )))
                .orElse(ResponseEntity.status(401).build());
    }
    
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> body) {
        try {
            String name = body.get("name");
            String email = body.get("email");
            String password = body.get("password");
            String roleStr = body.get("role");
            
            // Validate input
            if (name == null || email == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Name, email and password are required"));
            }
            
            // Check if user already exists
            if (userRepository.existsByEmail(email)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email already in use"));
            }
            
            // Determine role (default to VIEWER if not specified)
            RoleName role = RoleName.ROLE_VIEWER;
            if (roleStr != null && !roleStr.isEmpty()) {
                try {
                    role = RoleName.valueOf(roleStr);
                } catch (IllegalArgumentException e) {
                    // Invalid role, use default
                }
            }
            
            // Create user with specified role
            User user = userService.createUser(name, email, password, role);
            
            // Generate token for the new user
            var roles = user.getRoles().stream().map(r -> r.getName().name()).collect(Collectors.toList());
            Map<String, Object> claims = new HashMap<>();
            claims.put("roles", roles);
            String token = jwtUtil.generateToken(user.getEmail(), claims);
            
            // Return user info and token
            Map<String, Object> resp = new HashMap<>();
            resp.put("token", token);
            resp.put("roles", roles);
            resp.put("user", Map.of("id", user.getId(), "name", user.getName(), "email", user.getEmail()));
            
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}