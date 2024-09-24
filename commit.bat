@echo on
:: Pull the latest changes from the main branch (Keo nhung thay doi moi nhat tu nhanh main)
git pull origin main && echo  Enter your commit message (Nhap tin nhan commit): && set /p commitMessage="Enter your commit message: (Nhap tin nhan commit): " && echo  Staging all changes (Them tat ca cac thay doi) && git add . && echo  Committing changes (Commit thay doi) && git commit -m "%commitMessage%" && echo  Pushing changes to the current branch (Day cac thay doi len nhanh hien tai) && git push
