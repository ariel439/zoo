package com.zoo.santuario.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${SENDGRID_API_KEY}")
    private String sendGridApiKey;

    @Value("${SENDGRID_FROM_EMAIL}")
    private String fromEmail;

    private static final String SENDGRID_API_URL = "https://api.sendgrid.com/v3/mail/send";

    public void sendAnimalNotificationEmail(String to, String subject, String body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(sendGridApiKey);

        Map<String, Object> emailRequest = new HashMap<>();

        // From email
        Map<String, String> from = new HashMap<>();
        from.put("email", fromEmail);
        emailRequest.put("from", from);

        // To email
        Map<String, String> toEmail = new HashMap<>();
        toEmail.put("email", to);
        Map<String, Object> personalizations = new HashMap<>();
        personalizations.put("to", Collections.singletonList(toEmail));
        personalizations.put("subject", subject);
        emailRequest.put("personalizations", Collections.singletonList(personalizations));

        // Content
        Map<String, String> content = new HashMap<>();
        content.put("type", "text/html");
        String emailTemplate = """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
                    .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
                    .header { text-align: center; padding-bottom: 20px; }
                    .header img { max-width: 150px; height: auto; }
                    .content { font-size: 16px; line-height: 1.6; color: #333333; }
                    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #aaaaaa; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="https://i.imgur.com/SLq0f7N.png" alt="Zoo Santuario Logo">
                    </div>
                    <div class="content">
                        %s
                    </div>
                    <div class="footer">
                        <p>Atenciosamente,<br>Gerência do Zoológico</p>
                    </div>
                </div>
            </body>
            </html>
            """;
        String finalBody = emailTemplate.replace("%s", body.replace("%", "%%"));
        content.put("value", finalBody);
        emailRequest.put("content", Collections.singletonList(content));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(emailRequest, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    SENDGRID_API_URL, HttpMethod.POST, request, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                System.out.println("Email sent successfully to: " + to);
            } else {
                System.err.println("Failed to send email to " + to + ": " + response.getStatusCode() + " - " + response.getBody());
            }
        } catch (Exception e) {
            System.err.println("Error sending email to " + to + ": " + e.getMessage());
            e.printStackTrace();
        }
    }
}