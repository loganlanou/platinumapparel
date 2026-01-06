package clerk

import (
	"context"
	"fmt"

	clerkgo "github.com/clerk/clerk-sdk-go/v2"
	"github.com/clerk/clerk-sdk-go/v2/user"
)

type User struct {
	ID        string
	Email     string
	FirstName string
	LastName  string
	ImageURL  string
}

type Service struct {
	secretKey string
}

func New(secretKey string) *Service {
	if secretKey != "" {
		clerkgo.SetKey(secretKey)
	}
	return &Service{
		secretKey: secretKey,
	}
}

func (s *Service) GetUser(ctx context.Context, userID string) (*User, error) {
	if s.secretKey == "" {
		return nil, fmt.Errorf("clerk secret key not configured")
	}

	clerkUser, err := user.Get(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from Clerk: %w", err)
	}

	var email string
	if len(clerkUser.EmailAddresses) > 0 {
		email = clerkUser.EmailAddresses[0].EmailAddress
	}

	var firstName, lastName, imageURL string
	if clerkUser.FirstName != nil {
		firstName = *clerkUser.FirstName
	}
	if clerkUser.LastName != nil {
		lastName = *clerkUser.LastName
	}
	if clerkUser.ImageURL != nil {
		imageURL = *clerkUser.ImageURL
	}

	return &User{
		ID:        clerkUser.ID,
		Email:     email,
		FirstName: firstName,
		LastName:  lastName,
		ImageURL:  imageURL,
	}, nil
}

func (s *Service) IsConfigured() bool {
	return s.secretKey != ""
}
