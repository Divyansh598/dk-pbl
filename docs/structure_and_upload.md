# Project Structure & Upload Guide

## 📂 Folder Organization

This project follows a scalable, industry-standard React architecture.

```
recommender-ai/
├── .github/             # GitHub Actions for automatic deployment
├── docs/                # Documentation & Planning artifacts
├── public/              # Static assets (favicons, manifest)
├── src/                 # Source Code
│   ├── assets/          # Images and global static files
│   ├── components/      # Reusable UI blocks (Buttons, Cards, Forms)
│   ├── context/         # Global State (Auth, User Data)
│   ├── hooks/           # Custom React Hooks
│   ├── pages/           # Main Route Views (Home, Login, Admin)
│   ├── services/        # API Handling & External Services
│   ├── styles/          # Global CSS & Tailwind configuration
│   └── utils/           # Helper functions (Formatters, Constants)
├── .gitignore           # Specifies files to exclude from Git (e.g., node_modules)
└── package.json         # Project dependencies and scripts
```

## 🚀 How to Upload to GitHub

Since `node_modules` is heavy and should **never** be uploaded, we have configured `.gitignore` to automatically exclude it.

### Option 1: Using Git (Recommended)

1.  Initialize Git (if not already done):
    ```bash
    git init
    ```
2.  Add all files:
    ```bash
    git add .
    ```
    *(Note: This command automatically respects `.gitignore` and skips `node_modules`)*
3.  Commit your changes:
    ```bash
    git commit -m "Initial commit of MoodWatch"
    ```
4.  Push to GitHub:
    ```bash
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
    git push -u origin main
    ```

### Option 2: Manual Upload (Drag & Drop)

If you prefer to drag and drop files onto the GitHub website:

1.  **Select Everything EXCEPT**:
    - `node_modules/` folder
    - `dist/` folder
    - `.env` file
2.  Drag the remaining folders (`src`, `public`, `docs`, etc.) and files (`package.json`, `vite.config.js`, `README.md`) into the GitHub upload area.
3.  Commit the changes.

> **Tip**: The total size without `node_modules` should be less than 5MB, making it very easy to upload.
