# 待辦清單 Web App 作品集

這是我在 **GitHub Copilot 實戰工作坊** 中,從零開始使用 GitHub Copilot Agent Mode 完成的待辦清單(To-Do List)Web App。專案涵蓋了功能開發、UI/UX 優化、無障礙檢查,以及透過 agentic workflow 自動修復 GitHub Issue 並開 PR 的完整流程。

## 線上展示

<https://yytsui.github.io/copilot-workshop/>

## 功能

- 輸入待辦事項並新增(輸入空白內容不會新增)
- 勾選項目為完成,已完成項目會加上刪除線並淡化顯示
- 刪除單筆待辦事項
- 「清除已完成」按鈕:一次刪除所有已完成項目,操作前會跳出確認對話框,沒有已完成項目時按鈕會自動隱藏
- 依「全部 / 未完成 / 已完成」篩選清單,篩選後清單為空時會顯示對應提示文字(明確告知項目只是被篩選隱藏,並非被刪除)
- 底部即時顯示「未完成:N 項」,數字永遠反映整體資料,不受篩選影響
- 深色 / 淺色模式切換:使用者手動切換過的偏好會記住,尚未手動設定時則跟隨作業系統設定
- 待辦事項資料存於瀏覽器 `localStorage`,重新整理頁面後資料仍在
- 版面置中、卡片式設計,並支援手機等小螢幕的響應式排版(RWD)

## 技術

- 純 HTML / CSS / 原生 JavaScript(Vanilla JS),沒有使用任何前端框架或函式庫
- 沒有建立 `package.json`,不需要任何套件安裝或建置流程,下載後即可離線開啟使用
- 顏色統一透過 `:root` 定義的 CSS 變數管理,並針對深色模式的文字與按鈕對比度做過調整,以符合基本的無障礙色彩對比建議
- 資料持久化完全仰賴瀏覽器內建的 `localStorage`,沒有後端伺服器或資料庫

## 開發方式

這個專案的開發流程大量運用了 GitHub Copilot 的 Agent Mode 與相關工具鏈:

- 使用 **Agent Mode** 以多輪對話的方式逐步構建功能,從最初的新增/完成/刪除,到後續加入深色模式、篩選、清除已完成等功能
- 在 `.github/copilot-instructions.md` 中定義專案的技術限制與程式風格規範(純前端、CSS 變數、命名慣例等),讓 Agent 在每次修改時都遵循同一套標準
- 透過 `.vscode/mcp.json` 接上 **Microsoft Learn MCP Server**,查詢官方文件(例如 `prefers-color-scheme` 與深色模式無障礙對比建議),並依查到的資訊調整實作
- 接上 **GitHub MCP Server**,讓 Agent 能直接讀取 repo 的 Issue 內容、建立分支、提交修改、推送並開啟 Pull Request
- 撰寫 `.github/prompts/fix-issue.prompt.md` 作為可重複使用的 agentic workflow:給定一個 Issue 編號,Agent 會依序讀取 Issue → 提出計畫等待確認 → 建立分支 → 修改程式碼 → 說明驗證方式 → 提交推送 → 開 PR,這套流程被實際用來修復兩個真實的 GitHub Issue(#3、#4)

## 我學到什麼

- 把專案規範寫進 `.github/copilot-instructions.md` 之後,即使跨越多輪不同的需求,Copilot 的輸出風格與技術限制仍能維持一致
- MCP Server 讓 Agent 能查詢官方文件、操作 GitHub,把「查資料」跟「執行動作」都整合進同一個對話流程,不用手動切換到瀏覽器
- 把「修 Issue 並開 PR」這種重複性高的流程寫成 `.prompt.md`,可以讓 Agent 每次都照著同樣嚴謹的步驟(先摘要、等確認、才動手)執行,降低誤改或跳步的風險
- 深色模式不能只是換顏色,實際用對比度公式檢查後才發現原本的配色在某些文字上對比不足,顯示驗證這一步真的必要
- 讓 Agent 在改動前先列出計畫並等待確認,對於維持自己對專案變更的掌控感很有幫助,尤其是在多個 issue 交錯處理時
