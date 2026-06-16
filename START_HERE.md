# START HERE — Riaz & Sons Solution: Complete How-To

Everything you can do, step by step. Keep this file handy.

## Your links & locations
- **Live website:** https://sonoodevil.github.io/riaz-and-sons-solution/
- **Visual editor:** https://sonoodevil.github.io/riaz-and-sons-solution/editor.html
- **GitHub repo:** https://github.com/sonoodevil/riaz-and-sons-solution
- **Edit/publish folder (on your PC):** `C:\Users\NEXUS-Home\riaz-deploy-live`
- **Full project (backend + docs):** `C:\Users\NEXUS-Home\riaz-and-sons-solution`
- **Download zips:** `D:\DOwnloads\Riaz-and-Sons-Solution-WEBSITE.zip` and `Riaz-public_html-READY.zip`

---

## 1) View the website
- **Online:** just open the live link above (works on phone & PC, free, HTTPS).
- **On your PC (with booking database + live data):** open the full project folder and double-click
  **`run_windows.bat`**, then open **http://127.0.0.1:8000**.

---

## 2) Edit content with the visual editor (no coding) ⭐
1. Open the editor: **https://sonoodevil.github.io/riaz-and-sons-solution/editor.html**
2. Change anything — headline, services, projects, gallery, leadership, contacts, videos.
   - Lists (videos, projects, gallery…) have **“+ Add item”** and **“Remove”** buttons.
   - For a photo: type a path like `assets/myphoto.jpg`, or use the file picker for a quick preview.
3. Click **💾 Save & Preview** → a new tab opens showing your changes.
4. When happy, click **⬇ Export content.js** → it downloads `content.js` to your Downloads.
5. **Publish it (see step 5).**

> The editor saves to *your browser only* until you export + publish. That keeps the live site safe while you experiment.

---

## 3) Edit content by code (alternative to the editor)
Open `content.js` (in the edit folder) in Notepad/VS Code. It's one commented file holding all text,
image paths, videos and contacts. Change a value, save, then publish (step 5). Example:
```js
hero: { headline: "Your New Headline {gold:Highlighted Part}", ... }
```
`{gold:...}` colours that part gold.

---

## 4) Add or change photos / videos
**Photo:**
1. Copy your image into `C:\Users\NEXUS-Home\riaz-deploy-live\assets\` (use a simple name, e.g. `new-lift.jpg`).
2. In the editor (or `content.js`), set the image to `assets/new-lift.jpg`.
3. Publish (step 5).

**Video — best for online (YouTube Unlisted):**
1. Upload the clip to YouTube → set **Visibility: Unlisted**.
2. Copy the ID from `https://youtu.be/THIS_ID`.
3. In the editor’s **Videos** section, paste `THIS_ID` into the video’s *YouTube* field (or the local mp4 path in *src*).
4. Publish.

---

## 5) Publish your changes to the LIVE site
After editing (exported `content.js`, or added images/edited files):
1. If you exported `content.js`, copy it from Downloads into `C:\Users\NEXUS-Home\riaz-deploy-live\` (replace the old one).
   Put any new images into `C:\Users\NEXUS-Home\riaz-deploy-live\assets\`.
2. Open **PowerShell** and run these 3 lines:
   ```powershell
   git -C C:\Users\NEXUS-Home\riaz-deploy-live add -A
   git -C C:\Users\NEXUS-Home\riaz-deploy-live commit -m "Update content"
   git -C C:\Users\NEXUS-Home\riaz-deploy-live push
   ```
3. Wait ~1 minute → refresh the live link. Done. ✅
   (Tip: type `! git -C C:\Users\NEXUS-Home\riaz-deploy-live status` here and I can help if anything errors.)

---

## 6) The 3D Tech Lab (what it does)
On the live site, scroll to **3D Lab**:
- **Generator** tab — Start/Stop/Fault buttons; RPM, voltage, temperature, fuel move live.
- **Lift** tab — pick a floor (G–5), cabin moves in 3D.
- **HVAC** tab — outdoor unit with spinning fan.
- Below the model, a **“Key Parts & Technical Points”** list shows the real parts/specs of each system.
No setup needed — it runs in the browser.

---

## 7) Booking & dashboard
- The **Book Service** form sends the request to your **WhatsApp (0305-8967537)** and logs it in the
  on-page **Operations Dashboard** (Field Reports & activity also appear there).
- Field-report tools (Lift/Genset/HVAC/Civil/Electrical) calculate live and make a clean report you can save/share.

---

## 8) Connect your .com.pk domain (when you buy it)
Recommended name: **riazandsons.com.pk** (no “&” allowed in domains).
1. Register it at PKNIC: https://pk6.pknic.net.pk
2. Point DNS (in PKNIC or free Cloudflare):
   - `A  @  185.199.108.153` / `.109.153` / `.110.153` / `.111.153`
   - `CNAME  www  sonoodevil.github.io.`
3. GitHub repo → **Settings → Pages → Custom domain** → type the domain → **Save** → tick **Enforce HTTPS**.
Full details: `CUSTOM_DOMAIN.md`. Activation kit (ready CNAME): `domain-activation\`.

---

## 9) Optional — live backend (database booking + telemetry)
Only if you want bookings saved to a real database online:
1. Create a free account at https://render.com → **New → Blueprint** → connect this repo → **Apply**
   (it reads `render.yaml`).
2. Copy the service URL it gives you.
3. In `app.js`, set `const API = "https://<that-url>";` then publish (step 5).
Without this, the site is fully functional (bookings go to WhatsApp).

---

## 10) Troubleshooting
- **Change not showing?** Hard-refresh the page: **Ctrl + Shift + R**. GitHub takes ~1 min to rebuild after a push.
- **Page looks broken after editing `content.js`?** You likely removed a quote or comma — undo and re-export from the editor instead.
- **Image not loading?** Filename must match exactly (it’s case-sensitive online) and be inside `assets/`.
- **Need help with a git error?** Paste it to me, or type `! git -C C:\Users\NEXUS-Home\riaz-deploy-live status`.

---

### Quick reference — the one publish command (PowerShell)
```powershell
cd C:\Users\NEXUS-Home\riaz-deploy-live ; git add -A ; git commit -m "update" ; git push
```
