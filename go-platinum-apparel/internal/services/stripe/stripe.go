package stripe

import (
	"encoding/json"
	"fmt"
	"io"

	"github.com/stripe/stripe-go/v82"
	"github.com/stripe/stripe-go/v82/checkout/session"
	"github.com/stripe/stripe-go/v82/paymentintent"
	"github.com/stripe/stripe-go/v82/webhook"
)

type CartItem struct {
	Name     string
	Price    int64 // in cents
	Quantity int64
	ImageURL string
}

type Service struct {
	secretKey     string
	webhookSecret string
}

func New(secretKey, webhookSecret string) *Service {
	if secretKey != "" {
		stripe.Key = secretKey
	}
	return &Service{
		secretKey:     secretKey,
		webhookSecret: webhookSecret,
	}
}

func (s *Service) CreateCheckoutSession(items []CartItem, successURL, cancelURL string, customerEmail string) (*stripe.CheckoutSession, error) {
	if s.secretKey == "" {
		return nil, fmt.Errorf("stripe secret key not configured")
	}

	var lineItems []*stripe.CheckoutSessionLineItemParams
	for _, item := range items {
		lineItems = append(lineItems, &stripe.CheckoutSessionLineItemParams{
			PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
				Currency: stripe.String("usd"),
				ProductData: &stripe.CheckoutSessionLineItemPriceDataProductDataParams{
					Name:   stripe.String(item.Name),
					Images: []*string{stripe.String(item.ImageURL)},
				},
				UnitAmount: stripe.Int64(item.Price),
			},
			Quantity: stripe.Int64(item.Quantity),
		})
	}

	params := &stripe.CheckoutSessionParams{
		PaymentMethodTypes: []*string{stripe.String("card")},
		LineItems:          lineItems,
		Mode:               stripe.String(string(stripe.CheckoutSessionModePayment)),
		SuccessURL:         stripe.String(successURL),
		CancelURL:          stripe.String(cancelURL),
		ShippingAddressCollection: &stripe.CheckoutSessionShippingAddressCollectionParams{
			AllowedCountries: []*string{stripe.String("US"), stripe.String("CA")},
		},
	}

	if customerEmail != "" {
		params.CustomerEmail = stripe.String(customerEmail)
	}

	return session.New(params)
}

func (s *Service) CreatePaymentIntent(amount int64, currency string, metadata map[string]string) (*stripe.PaymentIntent, error) {
	if s.secretKey == "" {
		return nil, fmt.Errorf("stripe secret key not configured")
	}

	params := &stripe.PaymentIntentParams{
		Amount:   stripe.Int64(amount),
		Currency: stripe.String(currency),
	}

	if len(metadata) > 0 {
		params.Metadata = make(map[string]string)
		for k, v := range metadata {
			params.Metadata[k] = v
		}
	}

	return paymentintent.New(params)
}

func (s *Service) GetPaymentIntent(id string) (*stripe.PaymentIntent, error) {
	if s.secretKey == "" {
		return nil, fmt.Errorf("stripe secret key not configured")
	}
	return paymentintent.Get(id, nil)
}

func (s *Service) VerifyWebhook(payload []byte, signature string) (stripe.Event, error) {
	return webhook.ConstructEvent(payload, signature, s.webhookSecret)
}

func (s *Service) ParseWebhookEvent(body io.Reader, signature string) (*stripe.Event, error) {
	payload, err := io.ReadAll(body)
	if err != nil {
		return nil, fmt.Errorf("failed to read webhook body: %w", err)
	}

	event, err := s.VerifyWebhook(payload, signature)
	if err != nil {
		return nil, fmt.Errorf("webhook signature verification failed: %w", err)
	}

	return &event, nil
}

func (s *Service) GetCheckoutSession(sessionID string) (*stripe.CheckoutSession, error) {
	if s.secretKey == "" {
		return nil, fmt.Errorf("stripe secret key not configured")
	}
	return session.Get(sessionID, nil)
}

func (s *Service) IsConfigured() bool {
	return s.secretKey != ""
}

// Helper to parse checkout session from webhook event
func ParseCheckoutSessionFromEvent(event *stripe.Event) (*stripe.CheckoutSession, error) {
	var sess stripe.CheckoutSession
	if err := json.Unmarshal(event.Data.Raw, &sess); err != nil {
		return nil, fmt.Errorf("failed to parse checkout session: %w", err)
	}
	return &sess, nil
}
