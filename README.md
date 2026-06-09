# Personal Portfolio Website

Welcome to my personal portfolio repository. This website is built using modern web standards to highlight my technical experience, full-stack projects, and design philosophies. It features a fully responsive layout, live data integration, and an automated contact management setup.

---

## Features

- **Dynamic Navigation Tracking:** A smart header layout that tracks your position on the page and automatically highlights the section you are currently looking at.
- **Live Project Integration:** Pulls my latest public projects and descriptions directly from GitHub in real time, displaying counts for stars and repository information.
- **Simplified Contact Form:** A user-friendly, clean contact interface with straightforward messaging and custom notification feedback upon successful form submission.
- **Automated Email Workflows:** Sends instantaneous emails to me whenever a visitor reaches out, while simultaneously delivering a elegant confirmation receipt back to the visitor's inbox.
- **Optimized Theme Handling:** Styled with an elegant, deep palette (Dracula inspired) that stays consistent from loading screens to page interaction.

---

## Built With

- **Framework:** Next.js (App Router layout)
- **Library:** React
- **Styling:** Tailwind CSS (for fully responsive design layout blocks)
- **Data Fetching:** Native Fetch API integrated with the GitHub REST API
- **Mail Delivery:** Nodemailer integration via custom Next.js serverless route streams

---

## Getting Started

### 1. Clone the Project

```bash
git clone https://github.com/madoyakimberley/your-repo-name.git
cd your-repo-name
```

### 2. Install Project Dependencies

```bash
npm install
```

### 3. Setup Your Environment Variables

Create a file named `.env.local` in the root folder of your project and populate it with your email configurations:

```env
# Mail Configuration Options
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password-or-email-password
RECEIVER_EMAIL=your-personal-inbox@gmail.com
```

> Note: If you use Gmail, make sure to generate an App Password within your Google Security settings rather than using your standard raw password.

### 4. Run the Development Server

```bash
npm run dev
```

Open http://localhost:3000 inside your browser to view your live portfolio workspace.

---

## Deployment

The portfolio is fully prepared for streamlined deployment on platforms like Vercel, Netlify, or standard cloud infrastructure providers.

When setting up your live deployment settings, ensure that you input all key values from your `.env.local` file straight into your platform environment variable settings dashboards.
