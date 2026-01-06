package ctxkeys

type siteConfigKey struct{}
type userKey struct{}
type clerkPublishableKeyKey struct{}
type stripePublishableKeyKey struct{}

var SiteConfig = siteConfigKey{}
var User = userKey{}
var ClerkPublishableKey = clerkPublishableKeyKey{}
var StripePublishableKey = stripePublishableKeyKey{}
