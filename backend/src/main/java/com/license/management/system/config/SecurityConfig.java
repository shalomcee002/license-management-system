package com.license.management.system.config;

import com.license.management.system.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Autowired
    private JwtAuthenticationFilter jwtFilter;
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeRequests()
                .antMatchers("/api/auth/**").permitAll()
                .antMatchers("/api/reports/**").hasAnyAuthority("ROLE_ADMIN","ROLE_OFFICER")
                .antMatchers("/api/fees/**", "/api/notifications/**").hasAuthority("ROLE_ADMIN")
                .antMatchers("/api/companies/**", "/api/licenses/**").hasAnyAuthority("ROLE_ADMIN","ROLE_OFFICER")
                .anyRequest().authenticated()
            .and()
            .addFilterBefore(jwtFilter, BasicAuthenticationFilter.class);
        return http.build();
    }
}
