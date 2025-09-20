package com.zoo.santuario;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext; // Import this

@SpringBootApplication
public class SantuarioApplication {

	public static void main(String[] args) {
		ConfigurableApplicationContext context = SpringApplication.run(SantuarioApplication.class, args);
		// Temporary logging to debug environment variables
		System.out.println("DEBUG: SPRING_DATASOURCE_URL = " + context.getEnvironment().getProperty("SPRING_DATASOURCE_URL"));
		System.out.println("DEBUG: MYSQL_HOST = " + context.getEnvironment().getProperty("MYSQL_HOST"));
		System.out.println("DEBUG: MYSQL_PORT = " + context.getEnvironment().getProperty("MYSQL_PORT"));
		System.out.println("DEBUG: MYSQL_DATABASE = " + context.getEnvironment().getProperty("MYSQL_DATABASE"));
		// End temporary logging
	}

}
