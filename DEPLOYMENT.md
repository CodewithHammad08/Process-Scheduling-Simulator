# 🚀 Deployment Guide: Vercel & Netlify

Since this project is built with **Django (Python)**, it requires a platform that supports server-side Python. **Vercel** is the best free option for this. **Netlify** is primarily for static sites (HTML/JS only), so Vercel is highly recommended for this project.

---

## 🏗️ Option 1: Deploying on Vercel (Recommended)

I have already pre-configured your project for Vercel by adding `vercel.json` and `vercel_app.py`.

### Step 1: Prepare your Repository
1. Push your code to a **GitHub**, **GitLab**, or **Bitbucket** repository.
2. Ensure `requirements.txt` is in the root directory (I have already generated this for you).

### Step 2: Deploy
1. Go to [Vercel.com](https://vercel.com) and log in.
2. Click **"Add New"** -> **"Project"**.
3. Import your GitHub repository.
4. Vercel will automatically detect the settings from `vercel.json`.
5. Click **Deploy**.

### Step 3: Important Settings
In `scheduler_project/settings.py`, ensure:
- `ALLOWED_HOSTS = ['*']` or your specific Vercel URL.
- `DEBUG = False` for production.

---

## 🏗️ Option 2: Deploying on Netlify (Alternative)

Netlify does not support Django natively as easily as Vercel. To use Netlify, you would need to use **Netlify Functions** (AWS Lambda), which is much more complex for a Django app.

**If you must use Netlify:**
1. You would need to convert the project to a **Static Site** (JAMstack) by moving all logic from Python to JavaScript.
2. Since our logic is already quite advanced in `main.js`, you could rewrite the algorithms in JS and host it as a pure static site on Netlify.

---

## 🛠️ Essential Files I've Added for You:

1. **`requirements.txt`**: Lists `Django` and other dependencies so the server knows what to install.
2. **`vercel.json`**: Tells Vercel how to handle the Python backend and the static CSS/JS files.
3. **`vercel_app.py`**: A small entry-point script required by Vercel to launch the Django application.

---

## 💡 Troubleshooting Deployment
- **Static Files Not Loading?** Ensure `STATIC_ROOT` is configured in `settings.py` and you run `python manage.py collectstatic` if deploying to a traditional VPS/Heroku. On Vercel, the `vercel.json` handles this.
- **CSRF Errors?** If you encounter CSRF issues on the hosted site, add your domain to `CSRF_TRUSTED_ORIGINS` in `settings.py`.
