# Copilot 專案指示

本專案為純前端待辦清單 App,提供給 Copilot 在此工作區中協作時遵循的規則。

## 技術限制

- 這是純前端專案,只使用 HTML、CSS、原生 JavaScript
- 禁止引入任何框架或套件(不要用 React / Vue / jQuery / Bootstrap / Tailwind 等),不要建立 `package.json`,不要執行 `npm install`
- 不要引用任何外部 CDN,整個 App 必須能離線開啟、離線運作
- 檔案結構固定為根目錄的 `index.html`、`styles.css`、`app.js`,不要額外拆分或新增建置流程

## 程式風格

- 註解一律使用繁體中文;變數與函式命名使用英文 camelCase
- CSS 顏色一律使用 `:root` 定義的 CSS 變數,不要在規則中寫死色碼
- 使用 `const` / `let`,不要使用 `var`
- 產生 DOM 內容時使用 `textContent` 或 `createElement`,不要用 `innerHTML` 組字串

## 協作方式

- 動手修改之前,先條列說明打算修改哪些檔案、做什麼變動,等使用者確認後才開始實作
- 一次只處理一件事,不要順手做使用者沒有要求的重構或額外調整
- 修改完成後,說明要如何在瀏覽器中開啟並驗證變更
