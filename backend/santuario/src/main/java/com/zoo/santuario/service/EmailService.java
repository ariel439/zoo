package com.zoo.santuario.service;

import com.resend.Resend;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final Resend resend;

    @Value("${resend.api.key}")
    private String resendApiKey;

    @Value("${resend.from.email}")
    private String fromEmail;

    public EmailService(@Value("${resend.api.key}") String resendApiKey) {
        this.resend = new Resend(resendApiKey);
    }

    public void sendAnimalNotificationEmail(String to, String subject, String body) {
        try {
            CreateEmailOptions createEmailOptions = CreateEmailOptions.builder()
                    .from(fromEmail)
                    .to(to)
                    .subject(subject)
                    .html(body)
                    .build();

            CreateEmailResponse response = resend.emails.send(createEmailOptions);
            System.out.println("Email sent successfully. ID: " + response.getId());
        } catch (Exception e) {
            System.err.println("Error sending email: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
