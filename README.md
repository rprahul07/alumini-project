# Alumni Connect Project

Welcome to the Alumni Connect project! This platform helps connect students and alumni through networking, mentorship, and sharing opportunities.

🤝 How to Contribute

This project uses a Git branching workflow with three main branches:

- dev – Main development branch  
- test – Testing/staging branch  
- prod – Production/live branch  

Please follow the steps below to collaborate effectively.

📌 1. Clone the Repository  
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

sql
Copy
Edit

2. Create Your Feature Branch from dev  
git checkout dev # Switch to dev
git pull origin dev # Make sure it's up to date
git checkout -b feature/<name> # Create a new feature branch

makefile
Copy
Edit

Example:  
git checkout -b feature/login-page

csharp
Copy
Edit

💻 3. Make Your Changes  
Work on your code. After editing files, stage and commit:  
git add .
git commit -m "Add: login page UI and form validation"

css
Copy
Edit

🚀 4. Push Your Feature Branch to GitHub  
git push origin feature/login-page

markdown
Copy
Edit

🔁 5. Create a Pull Request (PR)  
- Go to the GitHub repository in your browser.  
- Click "Compare & pull request" for your pushed branch.  
- Choose:  
   - Base branch: dev  
   - Compare branch: your feature branch  
- Add a clear title and description of your changes.  
- Click "Create pull request".

✅ 6. After Review & Merge  
- Once your PR is approved and merged into dev:  
- Maintainers will merge dev → test for QA/testing.  
- After successful testing, maintainers merge test → prod for production release.

🛑 Important Guidelines  
- Do NOT push directly to dev, test, or prod.  
- Do NOT work directly on test or prod branches.  
- Always work on feature branches created from dev.  
- Provide meaningful commit messages and PR descriptions.

🔒 Branch Protection  
- The test and prod branches are protected.  
- Only maintainers can merge into these branches after review.

🙌 Thank You for Contributing!  
Your efforts help improve this project and foster a collaborative environment. Happy coding! 🎉
