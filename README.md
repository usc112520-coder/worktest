# 一頁式作品集（方案 A）

純 HTML / CSS / JS 一頁式作品集，內容由 `content/portfolio.json` 驅動，透過 [Decap CMS](https://decapcms.org/) 後台編輯並經 Git 自動部署。

## 專案結構

```
├── index.html              # 首頁
├── content/portfolio.json  # 作品資料
├── images/portfolio/       # 作品圖片
├── admin/                  # Decap CMS 後台
├── css/style.css
├── js/main.js
└── netlify.toml
```

## 本機預覽

需使用本地伺服器（`fetch` 無法在 `file://` 下載入 JSON）：

```bash
# Python 3
python -m http.server 8080

# 或 Node.js
npx serve .
```

瀏覽 [http://localhost:8080](http://localhost:8080)

## 部署到 GitHub Pages（GitHub 自動部署）

### 1. 建立 GitHub 倉庫並推送

本專案對應倉庫：[usc112520-coder/worktest](https://github.com/usc112520-coder/worktest)。在本機執行：

```bash
cd C:\Users\Administrator\Desktop\cursor_proj01
git init
git add .
git commit -m "Initial portfolio site"
git branch -M main
git remote add origin https://github.com/usc112520-coder/worktest.git
git push -u origin main
```

部署完成後網站網址：**https://usc112520-coder.github.io/worktest/**

### 2. 啟用 GitHub Pages

1. 打開 repo → **Settings** → **Pages**
2. **Build and deployment** → **Source** 選 **GitHub Actions**
3. 推送 `main` 後，**Actions** 分頁會執行「Deploy to GitHub Pages」
4. 約 1～2 分鐘後，Pages 設定頁會顯示網址，例如：  
   `https://你的帳號.github.io/my-portfolio/`

也可手動觸發：**Actions** → **Deploy to GitHub Pages** → **Run workflow**

### 3. 更新網站

修改檔案後執行 `git add .`、`git commit`、`git push`，Actions 會自動重新部署。

### 關於管理後台（/admin）

GitHub Pages **只托管靜態檔案**。Decap CMS 後台需要 **Netlify Identity + Git Gateway** 才能線上登入發布。

| 需求 | 建議 |
|------|------|
| 只要網站上線 | 用 GitHub Pages 即可 |
| 要在網頁後台上傳作品 | 另用 [Netlify 部署](#部署到-netlify建議後台) 或改用手動編輯 `content/portfolio.json` 再 push |

---

## 部署到 Netlify（建議，含後台）

### 1. 推送到 GitHub

```bash
git init
git add .
git commit -m "Initial portfolio site"
git branch -M main
git remote add origin https://github.com/你的帳號/你的-repo.git
git push -u origin main
```

### 2. 連結 Netlify

1. 登入 [Netlify](https://www.netlify.com/) → **Add new site** → **Import an existing project**
2. 選擇 GitHub repo
3. Build settings：Publish directory 設為 **`.`**（根目錄），無需 build command
4. Deploy

### 3. 啟用 Identity 與 Git Gateway

1. Netlify 站台 → **Site configuration** → **Identity**
2. **Enable Identity**
3. **Registration preferences** → **Invite only**（只邀請自己）
4. **Identity** → **Services** → **Enable Git Gateway**
5. **Invite users** → 輸入你的 Email 並接受邀請信

### 4. 使用管理後台

1. 開啟 `https://你的網域.netlify.app/admin/`
2. 以 Netlify Identity 登入
3. 編輯「作品列表」→ 上傳圖片、修改標題與說明
4. 按 **Publish** → 等待重新部署（約 1～3 分鐘）

## 自訂內容

| 位置 | 說明 |
|------|------|
| `index.html` | Hero 文案、關於我、Email、社群連結 |
| `content/portfolio.json` | 作品列表（建議用後台改，也可手動編輯） |
| `css/style.css` | 色彩與版面（`:root` 變數） |

## 注意事項

- 後台僅在 Netlify（或已設定 Git Gateway 的環境）可登入發布
- 圖片上傳後路徑為 `/images/portfolio/檔名`
- 標籤用於首頁篩選按鈕，請保持簡短英文或中文皆可
