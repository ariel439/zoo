package com.zoo.santuario.service;

import com.resend.Resend;
import com.resend.SendEmailRequest;
import com.resend.SendEmailResponse;
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
            SendEmailRequest sendEmailRequest = SendEmailRequest.builder()
                    .from(fromEmail)
                    .to(to)
                    .subject(subject)
                    .html(body)
                    .build();

            SendEmailResponse response = resend.emails.send(sendEmailRequest);
            System.out.println("Email sent successfully. ID: " + response.getId());
        } catch (Exception e) {
            System.err.println("Error sending email: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
