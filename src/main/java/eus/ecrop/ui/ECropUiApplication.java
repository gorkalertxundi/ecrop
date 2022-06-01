package eus.ecrop.ui;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

/*
* @author Mikel Orobengoa
* @version 31/05/2022
*/

@SpringBootApplication
public class ECropUiApplication extends SpringBootServletInitializer{

	public static void main(String[] args) {
		SpringApplication.run(ECropUiApplication.class, args);
	}

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
		return builder.sources(ECropUiApplication.class);
	}
}
