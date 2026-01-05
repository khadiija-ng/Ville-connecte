package com.ville.connecte.service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.ville.connecte.model.Utilisateur;
import com.ville.connecte.repository.UtilisateurRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    public final UtilisateurRepository utilisateurRepository;

    public JwtService(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }
    public static final String SECRET = "MXAFhXFc0uqfqSg3kzestvb8sfaKSiEcEkCpruTOgloYmFhYTI0YjI2NWRjMWVmZTA1MzJlNTZhODI4OWY5Zjc1OTIyYTA2MmU5YzEzNjI1ZTNmM2I1MzY1ODQwMjYyNTYzNmIxODkxOWMzODA0OTFlZDlmODVmMzEwOGM3ZWZhZTc1OGExZjI3YzU0Nzk1NzAyOGQ0OTlkMjgzOTVmYjM=";

    // public void validateToken(final String token) {
    //     Jwts.parserBuilder().setSigningKey(getSignKey()).build().parseClaimsJws(token);
    // }

    public String generateRefreshToken(String userName, Long dureeValiditer) {
        Utilisateur user = utilisateurRepository.findByEmail(userName).get();
        Map<String, Object> claims = new HashMap<>();
        return createRefreshToken(claims, user, dureeValiditer);
    }

    public String generateToken(String userName, Long dureeValiditer) {
        Utilisateur user = utilisateurRepository.findByEmail(userName).orElseThrow(
                () -> new UsernameNotFoundException("Utilisateur non trouvé avec l'email : " + userName)
        );
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, user, dureeValiditer);
    }

    private String createRefreshToken(Map<String, Object> claims, Utilisateur user, Long dureeValiditer) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getEmail())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + dureeValiditer))
                .signWith(getSignKey(), SignatureAlgorithm.HS256).compact();

    }

    // public boolean validateRefreshToken(RefreshTokenRequest token) {
    //     try {
    //         Jwts.parserBuilder().setSigningKey(getSignKey()).build().parseClaimsJws(token.getToken());
    //         return true;
    //     } catch (JwtException | IllegalArgumentException e) {
    //         return false;
    //     }
    // }
    private Claims getClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String getClaim(String token, String claimName) {
    return getClaimsFromToken(token).get(claimName, String.class);
}


    // public String getUsernameFromToken(RefreshTokenRequest token) {
    //     return getClaimsFromToken(token.getToken()).getSubject();
    // }
    private String createToken(Map<String, Object> claims, Utilisateur user, Long dureeValiditer) {

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getEmail())
                .claim("id", user.getId())
                .claim("firstname", user.getFirstname())
                .claim("lastname", user.getLastname())
                .claim("email", user.getEmail())
                .claim("role", user.getRole().name()) // ENUM → String
                .claim("fonction", user.getFonction().name()) // ENUM → String
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + dureeValiditer))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getSignKey()).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    @SuppressWarnings("deprecation")
    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET)
                .parseClaimsJws(token)
                .getBody();
    }

    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    public String extractLastname(String token) {
        return (String) getAllClaimsFromToken(token).get("lastname"); // Extraire l'email à partir des claims
    }

    public String extractEmail(String token) {
        return (String) getAllClaimsFromToken(token).get("email"); // Extraire l'email à partir des claims
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> extractRoles(String token) {
        return (List<Map<String, Object>>) getAllClaimsFromToken(token).get("roles"); // Extraire l'email à partir des
        // claims
    }

    public Integer extractId(String token) {
        return (Integer) getAllClaimsFromToken(token).get("id"); // Extraire l'email à partir des claims
    }
    // La clé de signature obtenue via getSignKey() est utilisée pour vérifier la
    // signature du JWT.

    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
