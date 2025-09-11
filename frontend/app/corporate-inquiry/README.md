
## Deployment Guide for CorporateInquiryPage (Next.js + Web3Forms)

### Step 1: Create Web3Forms Access Key
1. Go to [Web3Forms](https://web3forms.com/) and sign up / log in.
2. Navigate to your dashboard and create a new access key.
3. Copy the key — it will be used in your project.

### Step 2: Create Environment File
1. In your Next.js project root, create `.env.local` (if it is not already created):
```bash
touch .env.local

Add your Web3Forms key:

NEXT_PUBLIC_WEB3FORMS_KEY=your-web3forms-key-here


NEXT_PUBLIC_ is required because the key will be used in client-side code.

-------
### Make sure .env.local is added to .gitignore:

.env.local

### Step 3: Update Your Code to Use the Env Variable

In CorporateInquiryPage.tsx (or .jsx), replace the hardcoded key with:

formData.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "");

## Step 4: Test Locally

1. Run your project locally:
```bash
npm run dev

Fill out the form and submit.

Confirm that the submission works and you receive the confirmation email.

Step 5: Prepare for Deployment
If deploying on Vercel (or another hosting service):
1.	Go to Project Settings → Environment Variables.
2.	Add:
o	Key: NEXT_PUBLIC_WEB3FORMS_KEY
o	Value: Your Web3Forms key
3.	Redeploy the project.
The deployed app will now use the environment variable securely.
________________________________________
Step 6: Push Code to Git
1.	Make sure .env.local is not committed.
2.	Push your code:
git add .
git commit -m "Prepare CorporateInquiryPage for deployment"
git push
3.	The API key remains safe because it’s only in .env.local and on your deployment environment.
________________________________________
✅ Step 7: Verify Deployment
1.	Open your deployed site.
2.	Submit the form and confirm:
o	The form sends successfully.
o	Confirmation email is received.
