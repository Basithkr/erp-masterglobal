package com.masterglobal.erp.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.GmailScopes;
import com.google.api.services.gmail.model.Message;
import com.google.common.io.BaseEncoding;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;

@Service
public class GmailApiService {

    private static final String APPLICATION_NAME = "MasterGlobal ERP";
    private static final GsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final List<String> SCOPES = Collections.singletonList(GmailScopes.GMAIL_SEND);

    // Inside container paths
    private static final String TOKENS_DIRECTORY_PATH = "/app/tokens";
    private static final String CREDENTIALS_PATH = "/app/secrets/google-credentials.json";

    private Gmail gmailService;

    private Gmail getGmailService() throws Exception {
        if (gmailService != null) {
            return gmailService;
        }

        final NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();

        // 🔹 Load credentials from file system (NOT classpath)
        File credFile = new File(CREDENTIALS_PATH);
        if (!credFile.exists()) {
            throw new FileNotFoundException("google-credentials.json not found at " + CREDENTIALS_PATH);
        }

        InputStream in = new FileInputStream(credFile);

        GoogleClientSecrets clientSecrets =
                GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(in));

        // 🔹 Ensure tokens directory exists
        File tokensDir = new File(TOKENS_DIRECTORY_PATH);
        if (!tokensDir.exists()) {
            tokensDir.mkdirs();
        }

        GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
                HTTP_TRANSPORT, JSON_FACTORY, clientSecrets, SCOPES)
                .setDataStoreFactory(new FileDataStoreFactory(tokensDir))
                .setAccessType("offline")
                .build();

        var credential = flow.loadCredential("user");

        if (credential == null) {
            throw new RuntimeException(
                    "No Gmail OAuth token found in /app/tokens. Copy tokens from local machine."
            );
        }

        gmailService = new Gmail.Builder(HTTP_TRANSPORT, JSON_FACTORY, credential)
                .setApplicationName(APPLICATION_NAME)
                .build();

        return gmailService;
    }

    public void sendEmail(String to, String subject, String bodyText) {
        try {
            Gmail service = getGmailService();

            String rawMessage = "To: " + to + "\r\n" +
                    "Subject: " + subject + "\r\n" +
                    "Content-Type: text/plain; charset=UTF-8\r\n\r\n" +
                    bodyText;

            byte[] bytes = rawMessage.getBytes(StandardCharsets.UTF_8);
            String encodedEmail = BaseEncoding.base64Url().encode(bytes);

            Message message = new Message();
            message.setRaw(encodedEmail);

            service.users().messages().send("me", message).execute();

        } catch (Exception e) {
            throw new RuntimeException("Failed to send email via Gmail API", e);
        }
    }
}