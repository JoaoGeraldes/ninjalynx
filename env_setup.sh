#!/bin/bash

# Prompt for development MongoDB URL (show input)
read -p "Enter your development MongoDB URL (ie: mongodb://localhost:27017/my_database): " dev_mongodb_database
echo ""

# Prompt for production MongoDB URL (show input)
read -p "Enter your production MongoDB URL: " prod_mongodb_database
echo "" 

# Prompt for plain text API key (show input)
read -p "Enter your API key (plain text): " api_key_as_plain_text
echo "" 

# Generate a random 32-byte (256-bit) key in hex
# random_key=$(openssl rand -hex 32)

# Hash the API key using SHA-256
hashed_api_key=$(echo -n "$api_key_as_plain_text" | sha256sum | awk '{print $1}')

# Create the .env file with the values
echo "API_KEY=$hashed_api_key" > .env
echo "DEV_MONGODB_DATABASE=$dev_mongodb_database" >> .env
echo "PROD_MONGODB_DATABASE=$prod_mongodb_database" >> .env

# Confirm the inputs before proceeding
echo ""
echo "Are these values correct?"
echo "_________________________"
echo "Your API key (as plain text): $api_key_as_plain_text"
echo "Your API key (as a SHA-256 digest): $hashed_api_key"
echo "Development MongoDB URL: $dev_mongodb_database"
echo "Production MongoDB URL: $prod_mongodb_database"
echo ""
read -p "Is this correct? (y/n): " confirmation

if [[ "$confirmation" != "y" ]]; then
    echo "❌ Operation aborted."
    exit 1
fi

# Confirm success
echo "✅ .env file generated with the values you provided."