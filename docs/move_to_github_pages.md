# Procedure for Moving a Website from Localhost to GitHub Pages

This guide provides a step-by-step procedure to move a website that works on localhost to GitHub Pages.

---

## Prerequisites
1. A GitHub account.
2. A GitHub repository for your project.
3. Node.js and npm installed on your system.
4. Your website should already work locally (e.g., using `npm run dev`).

---

## Steps

### 1. Prepare Your Project
1. **Ensure your project is version-controlled with Git**:
   - Initialize a Git repository if not already done: `git init`
   - Add your files: `git add .`
   - Commit your changes: `git commit -m "Initial commit"`

2. **Install `gh-pages`**:
   - Run: `npm install gh-pages --save-dev`

3. **Add a `deploy` script to `package.json`**:
   - Open `package.json` and add the following under `"scripts"`:
     ```json
     "deploy": "gh-pages -d dist"
     ```

---

### 2. Configure for GitHub Pages
1. **Set the Base URL**:
   - If your repository is a user/organization site (e.g., `username.github.io`), set the base URL to `/`.
   - If your repository is a project site (e.g., `username.github.io/repo-name`), set the base URL to `/repo-name/`.

   For Vite projects, update `vite.config.ts`:
   ```ts
   export default defineConfig({
     base: "/repo-name/", // Replace with "/" for user/organization sites
   });
   ```

2. **Handle SPA Routing**:
   - Add a `_redirects` file in the `public` directory with the following content:
     ```
     /*    /index.html   200
     ```
   - Create a `404.html` file in the `public` directory with a script to redirect to the main app:
     ```html
     <script>
       const redirectTo = window.location.pathname;
       window.location.href = "/" + redirectTo;
     </script>
     ```

3. **Optional: Add a CNAME File**:
   - If using a custom domain, create a `CNAME` file in the `public` directory with your domain name:
     ```
     example.com
     ```

---

### 3. Build and Deploy
1. **Build the Project**:
   - Run: `npm run build`

2. **Deploy to GitHub Pages**:
   - Run: `npm run deploy`

---

### 4. Configure GitHub Pages
1. Go to your GitHub repository settings.
2. Navigate to the "Pages" section.
3. Set the source branch to `gh-pages` and the folder to `/ (root)`.
4. Save the changes.

---

### 5. Verify the Deployment
1. Visit your GitHub Pages URL:
   - For user/organization sites: `https://username.github.io/`
   - For project sites: `https://username.github.io/repo-name/`
2. Test navigation and functionality.

---

## Notes
- For future changes, push updates to the `main` branch. The `deploy` script will handle redeployment.
- If you encounter issues, check the browser console and GitHub Pages settings.

---

This procedure ensures a smooth transition from localhost to GitHub Pages.