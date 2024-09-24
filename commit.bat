@echo off
:: Pull the latest changes from the main branch (Keo nhung thay doi moi nhat tu nhanh main)
git pull origin main

:: Check if the pull was successful (Kiem tra xem qua trinh keo co thanh cong khong)
if %errorlevel% neq 0 (
    echo "Error pulling from main. Resolve conflicts and try again. (Loi keo tu nhanh main. Giai quyet xung dot va thu lai.)"
    pause
    exit /b %errorlevel%
)

:: Ask for the commit message (Nhap tin nhan commit)
set /p commitMessage="Enter your commit message: (Nhap tin nhan commit): "

:: Stage all changes (Them tat ca cac thay doi)
git add .

:: Commit with the provided message (Commit voi tin nhan da nhap)
git commit -m "%commitMessage%"

:: Push changes to the current branch (Day cac thay doi len nhanh hien tai)
git push
