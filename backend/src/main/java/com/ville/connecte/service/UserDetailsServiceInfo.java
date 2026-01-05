package com.ville.connecte.service;

import java.util.List;
import java.util.function.Supplier;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.ville.connecte.controller.dto.request.UserPrincipal;
import com.ville.connecte.model.Utilisateur;
import com.ville.connecte.repository.UtilisateurRepository;

@Service
public class UserDetailsServiceInfo implements UserDetailsService {

    private final UtilisateurRepository utilisateurRepository;
    public UserDetailsServiceInfo(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
       Utilisateur utilisateur;
        utilisateur = utilisateurRepository.findByEmail(username)
                .orElseThrow(new Supplier<UsernameNotFoundException>() {
                    @Override
                    public UsernameNotFoundException get() {
                        return new UsernameNotFoundException("Utilisateur non trouvé : " + username);
                    }
                });

        List<GrantedAuthority> authorities;
        authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + utilisateur.getRole().name())
        );

        return new UserPrincipal(
                utilisateur.getId(),
                utilisateur.getFirstname() + " " + utilisateur.getLastname(),
                utilisateur.getEmail(),
                utilisateur.getEmail(),
                utilisateur.getPassword(),
                utilisateur.getRole(),
                utilisateur.getFonction(),
                authorities
        );
    }

}
