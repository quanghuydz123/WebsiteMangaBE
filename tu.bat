@echo off
:: Set the color (Text background)
color 0A  :: Black background with light green text
@echo on
echo  Switching to main branch (Chuyen sang nhanh main) && git checkout main && echo  Updating main branch (Cap nhat nhanh main) && git pull origin main && echo  Switching back to TU branch (Chuyen lai sang nhanh TU) && git checkout TU && echo  Pulling updates from main into TU (Keo cap nhat tu nhanh main sang nhanh TU) && git pull origin main && echo -- && echo -- && echo  Use the command "code ." to open VSCode (Su dung lenh "code ." de mo VSCode) && pause
:: Reset color
@echo off
color 07  :: Default color (white text on black background)