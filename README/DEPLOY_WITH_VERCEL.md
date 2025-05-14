[⬅️ Go back to README.md](../README.md)

You can self-host and deploy wherever you like; however, for simplicity, we provide instructions for deploying on Vercel. It’s straightforward to set up and even offers a free tier, which is perfect if you're just getting started.

- Go to Vercel and import the GitHub repository.

- Choose a project name and click Deploy.

- In your Vercel project settings, add the environment variables from your locally generated `.env` file.

- Click Redeploy to apply the changes.

- (**optional**) set your Functions Region to a location closer to your users (e.g., Paris, or something else).
  Vercel may default to US regions even if you're targeting Europe.

  ## Troubleshooting

  ### FUNCTION_INVOCATION_TIMEOUT or 504 Gateway Timeout

  - This typically means MongoDB is rejecting requests due to network restrictions.

    Go to MongoDB Atlas → Network Access

    Temporarily set `Allow Access from Anywhere` to test connectivity.

    Ensure that your hosting machine’s IP addresses are whitelisted or added to the allowed list.
