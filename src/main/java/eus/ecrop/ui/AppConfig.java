package eus.ecrop.ui;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import nz.net.ultraq.thymeleaf.layoutdialect.LayoutDialect;

@Component
@Configuration
@ConfigurationProperties
public class AppConfig {
    
    @Bean
    public LayoutDialect layoutDialect() {
      return new LayoutDialect();
    }

}
