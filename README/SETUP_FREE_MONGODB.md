[⬅️ Go back to README.md](../README.md)


## 1. Setting up [MongoDB Atlas](https://cloud.mongodb.com/)

### Create and configure your database

**If you are self-hosting your own MongoDB, you can skip these steps entirely, as they are only relevant if you choose not to self-host and want to use MongoDB's free tier instead.**

- Go to [mongodb.com](https://mongodb.com) and sign in or create an account.

- Deploy a new cluster. Choose AWS (or another provider if preferred), and select the **FREE** tier.

- Before using your MongoDB Atlas cluster, you need to secure it:

  - Navigate to **Network Access**.
  - Add the IP addresses that should be allowed to access your cluster (including the IP of your hosting server).
  - ⚠️ If you're using the **Hobby (free)** plan on Vercel, note that it doesn't support a dedicated IP. For testing purposes, you can choose **"Allow Access from Anywhere"** to ensure connectivity.

- Create a **Database User** and store the **Username** and **Password** securely.

- Choose a connection method and copy your **Connection URI**.
  - Example:
    ```
    mongodb+srv://<db_username>:<db_password>@cluster0.qzuhwz4.mongodb.net/
    ```
