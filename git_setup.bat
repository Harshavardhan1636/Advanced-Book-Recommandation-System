@echo off
echo ====================================================================
echo   SETTING UP GIT AND PUSHING TO GITHUB
echo ====================================================================
echo.

REM Configure Git
echo Configuring Git...
git config --global user.email "dpharshavardhan.1636@gmail.com"
git config --global user.name "Harshavardhan1636"
echo Done!
echo.

REM Initialize Git (if not already)
echo Initializing Git repository...
git init
echo Done!
echo.

REM Add remote
echo Adding remote repository...
git remote remove origin 2>nul
git remote add origin https://github.com/Harshavardhan1636/Advanced-Book-Recommandation-System.git
echo Done!
echo.

REM Add all files
echo Adding all files...
git add .
echo Done!
echo.

REM Commit
echo Committing changes...
git commit -m "Initial commit: Advanced Book Recommendation System with 97 endpoints, 19 services, ML/AI features"
echo Done!
echo.

REM Push to GitHub
echo Pushing to GitHub...
git branch -M main
git push -u origin main --force
echo Done!
echo.

echo ====================================================================
echo   SUCCESS! Repository pushed to GitHub
echo ====================================================================
echo.
echo Repository URL: https://github.com/Harshavardhan1636/Advanced-Book-Recommandation-System
echo.
pause
