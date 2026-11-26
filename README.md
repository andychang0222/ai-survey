# 企業生成式 AI 工具使用現況與導入需求調查

本專案為企業資訊管理單位（MIS）用於盤點內部各部門對生成式 AI 工具（ChatGPT、Claude、Gemini、Microsoft 365 Copilot 等）之使用現況、免費／付費版本分佈、工作用途與預計使用頻率的調查網頁，內建管理員統計儀表板與 Excel 相容 `.csv` 匯出功能。

## 專案檔案結構

- `index.html`：主頁面（包含員工調查問卷視圖、防釣魚資安公告、MIS 管理員統計後台與驗證視窗）
- `styles.css`：企業資訊單位深海藍商務視覺樣式與響應式無障礙表格排版
- `app.js`：表單條件展開驗證、SHA-256 管理員通行碼雜湊比對、統計圖表運算與 UTF-8 BOM CSV 匯出邏輯

## 部署至 GitHub Pages 步驟

1. 於 GitHub 建立一個新的 Repository（若使用免費版 GitHub Pages，請設為 `Public`）。
2. 於本專案資料夾執行以下 Git 指令推送檔案：
   ```powershell
   git remote add origin https://github.com/<您的GitHub帳號>/<儲存庫名稱>.git
   git branch -M main
   git push -u origin main
   ```
3. 進入 GitHub Repository 頁面的 **Settings > Pages**。
4. 在 **Build and deployment > Source** 選擇 `Deploy from a branch`，Branch 選擇 `main` 與 `/ (root)`，點擊 **Save**。
5. 等待約 1 分鐘後，即可取得 `https://<您的GitHub帳號>.github.io/<儲存庫名稱>/` 正式調查網址發送給同仁填寫。

## 自訂管理員通行碼雜湊與後續雲端串接

- **更換管理員通行碼**：請以 Node.js 或瀏覽器開發者工具計算新通行碼的 SHA-256 十六進位字串，替換 `app.js` 頂部 `CONFIG.adminPasscodeSha256` 之值。
- **串接跨電腦雲端資料庫**：日後決定採用 Google 試算表（Google Apps Script）或內部 API 時，僅需將接收端點填入 `app.js` 的 `CONFIG.cloudEndpointUrl`，即可自動將每筆送出資料同步至後端匯總。
