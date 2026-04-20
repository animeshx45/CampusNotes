# CampusNotes | NIT Srinagar Study Portal

The ultimate peer-to-peer study resource platform dedicated to the students of National Institute of Technology, Srinagar.

## 🚀 Getting Started

### 1. Firebase Setup (Required)
To make the login and upload features work, you must enable services in the Firebase Console:

1. **Enable Authentication**:
   - Go to [Firebase Console](https://console.firebase.google.com/) -> Build -> Authentication.
   - Click **Get Started**.
   - Enable **Email/Password** and **Google** sign-in providers.

2. **Enable Firestore**:
   - Go to Build -> Firestore Database.
   - Click **Create Database**.
   - Start in **Production Mode** (the app includes security rules in `firestore.rules` to protect your data).

3. **Enable Identity Toolkit**:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/apis/library/identitytoolkit.googleapis.com).
   - Ensure your project is selected and click **Enable**.

## 🛠 Features
- **Departmental Resources**: Filtered notes and papers for all 8 engineering branches.
- **AI Study Aid**: Generate summaries and mock questions from notes.
- **Student Driven**: Dynamic student and resource counters.
- **Secure**: Authentication-protected uploads and owner-only editing.

## 📱 Tech Stack
- Next.js 15 (App Router)
- Firebase (Auth & Firestore)
- Genkit (AI Features)
- ShadCN UI & Tailwind CSS
