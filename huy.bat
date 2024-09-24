@echo off
echo     Switching to main branch (Chuyen sang nhanh main)
git checkout main

:: Check if the checkout to main was successful
if %errorlevel% neq 0 (
    echo "Error: Could not switch to the main branch. (Loi: Khong the chuyen sang nhanh main.)"
    pause
    exit /b %errorlevel%
)

echo     Updating main branch (Cap nhat nhanh main)
git pull origin main

:: Check if the pull from main was successful
if %errorlevel% neq 0 (
    echo "Error: Could not pull from main. Resolve any issues and try again. (Loi: Khong the cap nhat tu nhanh main. Giai quyet van de va thu lai.)"
    pause
    exit /b %errorlevel%
)

echo     Switching back to HUY branch (Chuyen lai sang nhanh HUY)
git checkout HUY

:: Check if the checkout to HUY was successful
if %errorlevel% neq 0 (
    echo "Error: Could not switch to the HUY branch. (Loi: Khong the chuyen sang nhanh HUY.)"
    pause
    exit /b %errorlevel%
)

echo     Pulling updates from main into HUY (Keo cap nhat tu nhanh main sang nhanh HUY)
git pull origin main

:: Check if the pull from main to HUY was successful
if %errorlevel% neq 0 (
    echo "Error: Could not pull from main into HUY branch. (Loi: Khong the cap nhat tu nhanh main vao nhanh HUY.)"
    pause
    exit /b %errorlevel%
)

:: Success messages and instructions for VSCode
echo --
echo --
echo     Use the command "code ." to open VSCode (Su dung lenh "code ." de mo VSCode)
pause
