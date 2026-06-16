# HANDBOOK — Riaz & Sons Solution
### How to handle every task, with a worked example for each

This is the detailed manual. For the quick version see `START_HERE.md`.
Every section shows **what to do** + a **real example** you can copy.

---

## 0. The golden rule (how publishing works)
You edit content, then run **one publish command**. That's it.

**Publish command (PowerShell):**
```powershell
cd C:\Users\NEXUS-Home\riaz-deploy-live ; git add -A ; git commit -m "update" ; git push
```
Wait ~1 minute, hard-refresh the site (**Ctrl+Shift+R**). Live link:
https://sonoodevil.github.io/riaz-and-sons-solution/

> **Two ways to edit:** (A) the visual **editor.html** (no code), or (B) edit **content.js** directly.
> Both change the same content. Pick whichever you like — examples below show the `content.js` line so you
> can see exactly what changes.

**Where files live:**
- Publish folder (what goes online): `C:\Users\NEXUS-Home\riaz-deploy-live`
- Master project (backend + docs): `C:\Users\NEXUS-Home\riaz-and-sons-solution`
- All editable content: `content.js`  · Images: `assets\`  · Videos: `assets\videos\`

---

## 1. Change the headline
**File:** `content.js` → `hero.headline`. Wrap the gold part in `{gold:...}`.

**Example — before:**
```js
headline: 'Engineering Services, Field Operations & {gold:Digital Monitoring} — One Platform.',
```
**after:**
```js
headline: 'Trusted Engineering Across Pakistan — {gold:Since 1965}.',
```
Then publish (section 0). Done ✅

---

## 2. Change any text line (sub-text, eyebrow)
**File:** `content.js` → `hero.eyebrow`, `hero.lead`.

**Example:**
```js
eyebrow: "Lift · Genset · HVAC · Civil · Electrical",
lead: "From a single elevator service call to a full MEP project — one trusted team since 1965.",
```

---

## 3. Edit the hero stats (the 1965 / 27+ / 200+ / 5 numbers)
**File:** `content.js` → `hero.stats` (a list).

**Example — change “27+ Projects” to “500+ Clients”:**
```js
stats: [
  { value: "1965", label: "Established" },
  { value: "500+", label: "Happy clients" },   // changed
  { value: "200+", label: "Elevator projects" },
  { value: "5",    label: "Offices nationwide" },
],
```

---

## 4. Edit / add / remove a Service card
**File:** `content.js` → `services` (list). `gold:true` = gold icon. `tags` = small chips.

**Example — add a “Solar” service:**
```js
services: [
  // ...existing 6...
  { icon: "☀️", gold: true, title: "Solar Solutions",
    text: "Rooftop & hybrid solar — design, supply and installation.",
    tags: ["On-grid","Hybrid","Net-metering"] },
],
```
**Remove one:** in the editor click **Remove** on that card; in code, delete its `{ ... }` block.

---

## 5. Add / remove a Project
**File:** `content.js` → `projects`. `badge: "gov"` (gold) or `"prv"` (blue).

**Example — add a new project:**
```js
projects: [
  // ...existing...
  { image: "assets/site-survey.jpg", badge: "gov", label: "Government Contract",
    title: "Punjab Hospital Lifts", text: "📍 Lahore — 6 passenger lifts supply & installation.",
    type: "Supply · Install · AMC", year: "2025" },
],
```

---

## 6. Add / change a Gallery photo
**File:** `content.js` → `gallery`. `tag: "real"` (green “Real Photo”) or `"ai"` (amber “AI Concept Visualization”).

**Step A — put the image in the folder:** copy `myphoto.jpg` into
`C:\Users\NEXUS-Home\riaz-deploy-live\assets\`

**Step B — add it:**
```js
gallery: [
  { image: "assets/myphoto.jpg", tag: "real", title: "New Lift Job", caption: "Johar Town, Lahore" },
  // ...existing...
],
```
Then publish. ⚠ Honesty rule: only use `tag:"real"` for genuine photos; AI images must be `tag:"ai"`.

---

## 7. Change Leadership (name, role, bio, photo)
**File:** `content.js` → `leadership`.

**Example — update Adnan’s bio + new photo:**
```js
{ tag: "Our Leadership", image: "assets/adnan-new.jpg",   // put adnan-new.jpg in assets\
  name: "Adnan Riaz", role: "Chief Executive — Riaz & Sons Solution",
  bio: "Leading nationwide engineering projects across five offices.",
  note: "“Quality, reliability, performance.”" },
```

---

## 8. Change contact details (phone / WhatsApp / Instagram / LinkedIn)
**File:** `content.js` → `contact`. WhatsApp is **digits only**, country code first.

**Example:**
```js
contact: {
  address: "156 Aurangzeb Block, New Garden Town, Lahore, Pakistan",
  landline: "+92 42-3595 2051",
  whatsapp: "923001234567",              // <- new number, digits only
  instagram: "riaz_and_sons_solution",
  linkedin: "riaz-sons-solution",
  website: "www.riazandsons.com",
  offices: ["Lahore","Islamabad","Karachi","Multan","Peshawar"],
},
```
This updates the contact block, the WhatsApp buttons **and** the booking form automatically.

---

## 9. Add / change a Video
**File:** `content.js` → `videos`.

**Option A — YouTube Unlisted (best for online):**
1. Upload to YouTube → Visibility **Unlisted** → copy ID from `https://youtu.be/ABC123xyz`.
2. ```js
   { title: "New Site Visit", note: "YouTube", poster: "assets/site-survey.jpg",
     src: "", youtube: "ABC123xyz" },     // paste the ID here
   ```
**Option B — local file:** put the `.mp4` in `assets\videos\`, then:
```js
{ title: "Workshop Clip", note: "2 MB", poster: "assets/lift-workshop.jpg",
  src: "assets/videos/workshop.mp4", youtube: "" },
```
Leave `youtube:""` to use the local file; fill it to use the embed.

---

## 10. Set the “Watch Walkthrough” video
**File:** `content.js` → `walkthrough`.

**Example (YouTube):**
```js
walkthrough: { youtube: "ABC123xyz", src: "", poster: "assets/profile-board.jpg" },
```

---

## 11. Change the colours / theme
**File:** `styles.css` (top, the `:root` block).

**Example — make the gold warmer:**
```css
--gold:   #c89b3c;   /* was #d6af52 */
--gold-2: #ecc870;   /* was #f0d27a */
```
Save, copy `styles.css` to the publish folder, publish. Every gold element updates.

---

## 12. Use the visual editor (no code) — full walkthrough
1. Open **https://sonoodevil.github.io/riaz-and-sons-solution/editor.html**
2. Scroll to the section (e.g. **Videos**) → edit fields, or **+ Add item** / **Remove**.
3. Click **💾 Save & Preview** → a tab opens showing your changes (saved in your browser only).
4. Click **⬇ Export content.js** → it downloads.
5. Copy the downloaded `content.js` into `C:\Users\NEXUS-Home\riaz-deploy-live\` (replace), then **publish** (section 0).
6. **Reset** button = discard your browser edits and go back to the published version.

---

## 13. Publish — worked example (what we did for the headline)
```powershell
# 1. (only if you exported from the editor) copy the new file in:
copy "$env:USERPROFILE\Downloads\content.js" "C:\Users\NEXUS-Home\riaz-deploy-live\content.js"
# 2. publish:
cd C:\Users\NEXUS-Home\riaz-deploy-live
git add -A
git commit -m "Edit hero headline"
git push
```
Expected: `… main -> main`. Wait ~1 min → refresh site.

---

## 14. Undo / revert a change
**File-level undo (before publishing):** press **Ctrl+Z** in your editor, or in the visual editor click **Reset**.

**Revert the last published change (git):**
```powershell
cd C:\Users\NEXUS-Home\riaz-deploy-live
git revert --no-edit HEAD
git push
```
This safely puts back the previous version and republishes.

---

## 15. Run the full app on your PC (with database booking + live data)
1. Open `C:\Users\NEXUS-Home\riaz-and-sons-solution`
2. Double-click **`run_windows.bat`** (installs and starts it).
3. Open **http://127.0.0.1:8000**. Bookings/reports save to a local database here.

---

## 16. Connect a .com.pk domain — worked example
Name (valid, no “&”): **riazandsons.com.pk**
1. Register at PKNIC: https://pk6.pknic.net.pk
2. In DNS (PKNIC, or free Cloudflare) add:
   ```
   A      @     185.199.108.153
   A      @     185.199.109.153
   A      @     185.199.110.153
   A      @     185.199.111.153
   CNAME  www   sonoodevil.github.io.
   ```
3. GitHub repo → **Settings → Pages → Custom domain** → `riazandsons.com.pk` → **Save** → tick **Enforce HTTPS**.
Details: `CUSTOM_DOMAIN.md`. Ready CNAME file: `domain-activation\CNAME`.

---

## 17. Optional — live database backend (Render, free)
1. https://render.com → **New → Blueprint** → connect the repo → **Apply** (uses `render.yaml`).
2. Copy the service URL (e.g. `https://riaz-sons-backend.onrender.com`).
3. In `app.js` set: `const API = "https://riaz-sons-backend.onrender.com";` → publish.
Now bookings save to a real database and the dashboard shows them online. Without this, bookings go to WhatsApp (already working).

---

## 18. The 3D Tech Lab (what each control does)
- **Generator tab:** Start/Stop/Trigger Fault/Reset → RPM, voltage, temperature, fuel respond live.
- **Lift tab:** floor buttons **G–5** → the cabin moves in 3D; Maintenance Alert/Reset.
- **HVAC tab:** outdoor unit with a spinning fan.
- The **“Key Parts & Technical Points”** list under the model changes per equipment — real parts/specs.
To edit those technical points, open `app.js` and find the `TECH` object (genset / lift / hvac arrays).

---

## 19. Field reporting tools (Lift/Genset/HVAC/Civil/Electrical)
Scroll to **Workflows**, pick a department, type the field readings → live calculations (e.g. HVAC tonnage,
Civil tiles+wastage, Electrical power & risk) → **Generate & Save Report** makes a clean report and lists it
in the dashboard. Nothing to set up.

---

## 20. Troubleshooting (each common issue)
| Problem | Fix |
|---|---|
| Change not visible | **Ctrl+Shift+R** (hard refresh). GitHub rebuilds ~1 min after `git push`. |
| Page looks broken after editing `content.js` | You removed a quote/comma. Press Ctrl+Z, or re-export from the editor (it can’t make syntax errors). |
| Image not showing | Filename must match **exactly** (case-sensitive online) and be inside `assets\`. |
| Video won’t play online | Use YouTube **Unlisted** (section 9) — large local files can be slow on free hosts. |
| `git push` asks for login / errors | Paste the error to your developer, or type `! git -C C:\Users\NEXUS-Home\riaz-deploy-live status`. |
| Want the previous version back | Section 14 (git revert). |

---

### One-line cheat-sheet
- **Edit:** editor.html  *or*  `content.js`
- **Publish:** `cd C:\Users\NEXUS-Home\riaz-deploy-live ; git add -A ; git commit -m "update" ; git push`
- **See it:** https://sonoodevil.github.io/riaz-and-sons-solution/  (Ctrl+Shift+R)
