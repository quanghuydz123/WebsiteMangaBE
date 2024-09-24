@echo off
echo $$$$$    Switching to main branch (Chuyen sang nhanh main)
git checkout main

:: Check if the checkout to main was successful
if %errorlevel% neq 0 (
    echo "Error: Could not switch to the main branch. (Loi: Khong the chuyen sang nhanh main.)"
    pause
    exit /b %errorlevel%
)

echo $$$$$    Updating main branch (Cap nhat nhanh main)
git pull origin main

:: Check if the pull from main was successful
if %errorlevel% neq 0 (
    echo "Error: Could not pull from main. Resolve any issues and try again. (Loi: Khong the cap nhat tu nhanh main. Giai quyet van de va thu lai.)"
    pause
    exit /b %errorlevel%
)

echo $$$$$    Switching back to TU branch (Chuyen lai sang nhanh TU)
git checkout TU

:: Check if the checkout to TU was successful
if %errorlevel% neq 0 (
    echo "Error: Could not switch to the TU branch. (Loi: Khong the chuyen sang nhanh TU.)"
    pause
    exit /b %errorlevel%
)

echo $$$$$    Pulling updates from main into TU (Keo cap nhat tu nhanh main sang nhanh TU)
git pull origin main

:: Check if the pull from main to TU was successful
if %errorlevel% neq 0 (
    echo "Error: Could not pull from main into TU branch. (Loi: Khong the cap nhat tu nhanh main vao nhanh TU.)"
    pause
    exit /b %errorlevel%
)

:: Success messages and instructions for VSCode
echo --
echo --
echo $$$$$    Use the command "code ." to open VSCode (Su dung lenh "code ." de mo VSCode)
pause
