# Walkthrough - Self-Service Student Material & Forum Moderation

We have added full self-service edit and delete functionalities for students who upload study materials, write forum threads, or reply with comments.

## Deployed Features

### 1. Study Materials Self-Deletion & Modification
* **Permission Logic**: If the currently authenticated user is either an `admin` OR the author who uploaded the study resource (matching `uploaderId` or name), they are granted full access to the **Modify** and **Delete Permanently** buttons on the resource detail page.
* **Navigation Flow**: Deleted resources automatically redirect back to the central `/browse` page, and show confirmation toasts.

### 2. Forum Threads Inline Editing & Deletion
* **Inline Author Forms**: If a student is the author of a forum thread, they can click **Edit Thread** directly on the thread detail page. This swaps the view with inline fields to edit the title and content.
* **API Put Handler**: Created `PUT /api/forum/[id]` to process updates on the database.
* **Self-Deletion**: Authors and administrators can delete forum posts permanently, redirecting back to `/forum`.

### 3. Comments/Replies Inline Editing & Deletion
* **Inline Comment Editing**: Authors can edit comments inline. Clicking the edit icon opens a text area in-place. Clicking "Save" updates the reply database subdocuments.
* **API Put replies Handler**: Created `PUT /api/forum/[id]/replies` to update nested replies content in MongoDB.
* **Self-Deletion**: Comments can be deleted by their owners and admins via the trash icon.
