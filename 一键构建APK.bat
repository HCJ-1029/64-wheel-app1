@echo off
chcp 65001 >nul
echo ================================================
echo            64转盘APP - APK构建工具
echo ================================================
echo.

:: 检查Java是否安装
echo [1/4] 检查Java环境...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到Java JDK
    echo.
    echo 请先安装Java JDK 17:
    echo 1. 访问: https://adoptium.net/temurin/releases/
    echo 2. 下载Windows x64版本的 .msi 安装包
    echo 3. 安装时务必勾选 "Set JAVA_HOME variable"
    echo 4. 安装完成后重启电脑
    echo.
    pause
    exit /b 1
) else (
    echo [成功] Java已安装
    java -version
)

echo.
echo [2/4] 同步Web资源到Android...
cd /d "%~dp0"
call npx cap sync android
if %errorlevel% neq 0 (
    echo [错误] 同步失败
    pause
    exit /b 1
)
echo [成功] 资源同步完成

echo.
echo [3/4] 构建APK（这可能需要5-10分钟）...
cd android
call .\gradlew.bat assembleDebug
if %errorlevel% neq 0 (
    echo [错误] 构建失败
    echo 请检查错误信息或查看 打包指南.md
    pause
    exit /b 1
)
echo [成功] APK构建完成！

echo.
echo [4/4] 复制APK到桌面...
set APK_SOURCE=%~dp0android\app\build\outputs\apk\debug\app-debug.apk
set APK_DEST=%USERPROFILE%\Desktop\64转盘.apk

if exist "%APK_SOURCE%" (
    copy "%APK_SOURCE%" "%APK_DEST%" /Y
    echo.
    echo ================================================
    echo [完成] APK已成功构建并复制到桌面！
    echo.
    echo 文件位置: %APK_DEST%
    echo.
    echo 接下来：
    echo 1. 将APK文件传到手机
    echo 2. 在手机上点击安装
    echo 3. 如提示"未知来源"，请在设置中允许安装
    echo ================================================
) else (
    echo [错误] 未找到APK文件
    echo 请检查构建日志
)

echo.
pause
