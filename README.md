# Notes Automation

This is a simple Node.js app that creates a `.md` file in a GitHub repo from markdown content sent via API.

## Features
- Send markdown content via API and it will create a file in your GitHub repo
- Custom folder path and file name support
- Secure authentication via GitHub token

## Setup

1. **Clone the repo and install dependencies:**
   ```bash
   git clone <repo-url>
   cd notes-automation
   npm install
   ```

2. **Create a .env file:**
   ```env
   GITHUB_TOKEN=your_github_personal_access_token
   GITHUB_USERNAME=your_github_username
   GITHUB_REPO=notes
   ```

3. **Start the server:**
   ```bash
   node index.js
   ```

## API Usage

**POST** `/create-md`

**Body:**
```json
{
  "content": "# Hello World\nThis is a test markdown file.",
  "folderPath": "notes/2024",
  "fileName": "my-note"
}
```

**Curl Example:**
```bash
curl -X POST http://localhost:3000/create-md \
  -H "Content-Type: application/json" \
  -d '{
    "content": "# Hello World\nThis is a test markdown file.",
    "folderPath": "notes/2024",
    "fileName": "my-note"
  }'
```

## Ignore Files
- `.env`
- `node_modules/`
- `logs/`
- `*.log`

## License
MIT 