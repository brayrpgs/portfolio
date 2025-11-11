```markdown
# Portfolio — Brayan Rosales Pérez

This repository is a personal portfolio template for Brayan Rosales Pérez. Default language is English with an in-page toggle to Spanish.

How to use
1. Edit data/projects.json to add your projects. Each project supports:
   - name (string)
   - description (string)
   - repo_link (url)
   - live_link (url)
   - stack (array of strings)
   - year (string or number)
   - complexity (string: e.g., Low/Medium/High)
   - images (array of image paths or URLs)
   - videos (array of up to 2 video URLs; YouTube links will embed automatically)

2. Replace contact info in index.html (email, phone) if desired.

3. Commit and push to GitHub. If the repo is named `brayrpgs.github.io` the site will be served at:
   https://brayrpgs.github.io
   Otherwise, this workflow publishes to the gh-pages branch and Pages should be enabled for the branch `gh-pages` in repository settings.

Create the repo and deploy
- Option A (I push): Create a new public repo named `portfolio` in your account and then confirm here: "repo created" — I'll push the files to `brayrpgs/portfolio` main and finish the Pages setup.
- Option B (You push): Use the commands below from a local folder containing these files:

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/brayrpgs/portfolio.git
git push -u origin main
```

Notes
- The projects are stored in data/projects.json to make adding new projects simple.
- The site is responsive and has a GitHub-inspired theme color palette.
- The projects section includes a manual image carousel and supports embedding up to 2 videos per project.
```