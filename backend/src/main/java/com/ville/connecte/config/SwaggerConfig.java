package com.ville.connecte.config;

import org.springframework.context.annotation.Bean;

import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

public class SwaggerConfig {

    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
                .select()  //Sélection des endpoints
                .paths(PathSelectors.ant("/api/**")) //Swagger documente uniquement les URLs qui commencent par : /api
                .apis(RequestHandlerSelectors.basePackage("com.springtutorial")) //Swagger scanne seulement les contrôleurs dans :com.springtutorial
                .build();
    }
}
