# Ninjalynx

### A secure, self-hosted, and open-source secret/password manager that ensures full control over your secrets.

![Ninjalynx Preview](public/ninjalynx_demo.gif)

# 💻 Development

### A guide for developers

Ready to dive in?
Get started with Ninjalynx development in just a few steps! 🚀

1. Clone repository

1. (**optional**) Configure [settings.ts](./configurations/settings.ts) and enable/disable features and set up SETTINGS.

1. Install dependencies

   ```bash
   npm install
   ```

1. Configure the environment variables with

   ```bash
   npm setup
   ```

1. Run the app

   ```bash
   npm run dev
   ```

1. Run the tests
   ```bash
   npm run test
   ```

#### [Troubleshooting guide for development](README/DEVELOPMENT_TROUBLESHOOTING.md)

# 🚀 Deployment

This section provides detailed instructions for deploying the application using two methods: **Docker** and **Vercel**. This is not an exhaustive list, but rather a selection of two methods for simplicity. You should choose the deployment method that best suits your needs.

#### [Deploy with **Vercel** (method 1)](README/DEPLOY_WITH_VERCEL.md)

#### [Deploy with **Docker** (method 2)](README/DEPLOY_WITH_DOCKER.md)

# Setting up MongoDB database

You can either self-host MongoDB or use MongoDB Atlas (free tier - up to 500MB). If you want, check out a brief instruction on [how to setup the free tier](README/SETUP_FREE_MONGODB.md).

# 🔑 Encryption

- ## How is data being encrypted

  Each newly created item is encrypted using symmetric encryption with [AES-GCM](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt#aes-gcm) algorithm. The encryption process follows a consistent pattern:

  We use the native [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Window/crypto) for encryption.
  The **passphrase** (also referred to as the Master Key) is derived from a password (string) provided by the user.

  Each field of an item (password or username) is individually encrypted using this **passphrase** with a unique [initialization vector](https://en.wikipedia.org/wiki/Initialization_vector).

- ## Can I change my **master key** without creating a new database?

  Currently, this project does not support changing the master key. This means that if an item is created it will be encrypted with the key that was used at that time. If the user wants to change the master key, they will need to export the database and start a new one with the new key. Since this project supports importing and exporting databases, it is still possible to change the master key, but it is not supported as a feature.

- ## What happens if I change my **master key** and attempt to access a database that has items encrypted with another master key?

  If you change your master key and attempt to access a database that has items encrypted with another master key, you will not be able to decrypt the items. This is because the encryption and decryption process relies on the same master key. If the master key is changed, the items will not be accessible anymore.

  ### **Flowchart 1** - The process to generate the user's private (master) key.

  ```mermaid
  graph TD
    A[🗒️ User's
    **Plain Text Master Key** ] --> B[PBKDF2
    **Key Material**]
    B --> C[100000 Iterations
    **Key**]
    C --> D[AES-GCM SHA-256
    **🔑 Derived Key**]
  ```

  ### **Flowchart 2** - The process to encrypt a field

  ```mermaid
  graph TD
    A[🗒️Plain Text] --> B[🔑 AES-GCM SHA-256
    User's Derived Key
    +
    🆔 Random
    Initialization Vector]
    B --> C[🔒Cipher Text]
  ```
