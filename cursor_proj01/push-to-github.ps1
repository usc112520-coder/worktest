# 推送到 https://github.com/usc112520-coder/worktest
# 需先安裝 Git: https://git-scm.com/download/win

$ErrorActionPreference = "Stop"
$repoRoot = $PSScriptRoot
$remoteUrl = "https://github.com/usc112520-coder/worktest.git"

Set-Location $repoRoot

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "找不到 git。請安裝 Git for Windows 後重開終端機再執行此腳本。" -ForegroundColor Red
    Write-Host "下載: https://git-scm.com/download/win"
    exit 1
}

if (-not (Test-Path ".git")) {
    git init
    git branch -M main
}

$remotes = git remote 2>$null
if ($remotes -notcontains "origin") {
    git remote add origin $remoteUrl
} else {
    git remote set-url origin $remoteUrl
}

git add .
$status = git status --porcelain
if ($status) {
    git commit -m "Update portfolio site"
} else {
    Write-Host "沒有新變更可提交。"
}

Write-Host "正在推送到 GitHub..." -ForegroundColor Cyan
git push -u origin main

Write-Host ""
Write-Host "推送完成。請到 GitHub 設定 Pages：" -ForegroundColor Green
Write-Host "  https://github.com/usc112520-coder/worktest/settings/pages"
Write-Host "  Source 選擇: GitHub Actions"
Write-Host ""
Write-Host "網站網址（部署成功後）:" -ForegroundColor Green
Write-Host "  https://usc112520-coder.github.io/worktest/"
