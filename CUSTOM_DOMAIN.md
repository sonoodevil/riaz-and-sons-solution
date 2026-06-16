# Connect a custom .com.pk domain (GitHub Pages)

The live site: **https://sonoodevil.github.io/riaz-and-sons-solution/**
Repo: `sonoodevil/riaz-and-sons-solution`

> ⚠ A domain name can contain only **letters, numbers and hyphens** — **no `&`**.
> Use "and" instead. Recommended name: **`riazandsons.com.pk`** (matches your old `riazandsons.com`).
> Alternatives: `riazandsonssolutions.com.pk`, `riaz-sons-solution.com.pk`.

## Step 1 — Register the domain (PKNIC)
- Go to **https://pk6.pknic.net.pk** → search your chosen name → register (usually 2 years, no documents for `.com.pk`).
- Or buy it bundled with a host (Hostinger.pk, NayaTel, etc.).

## Step 2 — Point DNS at GitHub Pages
Add these records in your domain's DNS panel (PKNIC, or Cloudflare if you delegate nameservers — free & easiest).

**Apex domain** (`riazandsons.com.pk`) — four **A** records:
```
A   @   185.199.108.153
A   @   185.199.109.153
A   @   185.199.110.153
A   @   185.199.111.153
```
(optional IPv6 — four **AAAA** records):
```
AAAA @ 2606:50c0:8000::153
AAAA @ 2606:50c0:8001::153
AAAA @ 2606:50c0:8002::153
AAAA @ 2606:50c0:8003::153
```

**www subdomain** — one **CNAME**:
```
CNAME  www   sonoodevil.github.io.
```

## Step 3 — Activate on GitHub (the ONE step that flips it live)
Do this **after** Step 2's DNS is saved (wait until it resolves — minutes to a few hours):
1. Repo → **Settings → Pages → Custom domain** → type `riazandsons.com.pk` → **Save**.
   (This auto-creates the `CNAME` file in the repo.)
2. Tick **Enforce HTTPS** once the certificate is issued (GitHub does it automatically).

That's it — the site serves at `https://riazandsons.com.pk` and the github.io URL redirects to it.

> Don't add the `CNAME` file before the DNS is pointing, or the github.io link will redirect to a
> domain that isn't ready yet. Step 3 is the safe moment.

## Tip — easiest DNS via Cloudflare (free)
1. Add the domain to a free **Cloudflare** account; Cloudflare gives you two nameservers.
2. In your **PKNIC** panel, set the domain's nameservers to those two.
3. Add the A/AAAA/CNAME records (Step 2) in Cloudflare. Done — fast DNS + free SSL.
