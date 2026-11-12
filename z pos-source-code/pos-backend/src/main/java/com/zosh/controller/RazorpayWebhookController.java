package com.zosh.controller;

import com.zosh.domain.PaymentStatus;
import com.zosh.domain.SubscriptionStatus;
import com.zosh.modal.Payment;
import com.zosh.modal.Subscription;
import com.zosh.repository.PaymentRepository;
import com.zosh.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
@Slf4j
public class RazorpayWebhookController {

    private final PaymentRepository paymentRepository;
    private final SubscriptionRepository subscriptionRepository;

    @PostMapping("/razorpay")
    public ResponseEntity<String> handleRazorpayWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature
    ) {
        log.info("🔔 Received Razorpay Webhook Event");
        try {
            JSONObject event = new JSONObject(payload);
            String eventType = event.optString("event");

            if ("payment_link.paid".equals(eventType) || "order.paid".equals(eventType)) {
                JSONObject payloadObj = event.getJSONObject("payload");
                JSONObject paymentEntity = payloadObj.has("payment")
                        ? payloadObj.getJSONObject("payment").getJSONObject("entity")
                        : null;

                if (paymentEntity != null && paymentEntity.has("notes")) {
                    JSONObject notes = paymentEntity.getJSONObject("notes");
                    if (notes.has("payment_id")) {
                        Long paymentId = Long.parseLong(notes.getString("payment_id"));
                        paymentRepository.findById(paymentId).ifPresent(payment -> {
                            payment.setStatus(PaymentStatus.SUCCESS);
                            payment.setPaidAt(LocalDateTime.now());
                            paymentRepository.save(payment);

                            Subscription subscription = payment.getSubscription();
                            if (subscription != null) {
                                subscription.setStatus(SubscriptionStatus.ACTIVE);
                                subscription.setPaymentStatus(PaymentStatus.SUCCESS);
                                subscriptionRepository.save(subscription);
                                log.info("✅ Subscription #{} activated via Razorpay webhook", subscription.getId());
                            }
                        });
                    }
                }
            }
            return ResponseEntity.ok("Webhook processed successfully");
        } catch (Exception e) {
            log.error("❌ Error processing Razorpay webhook: {}", e.getMessage(), e);
            return ResponseEntity.ok("Ignored with error: " + e.getMessage());
        }
    }
}

