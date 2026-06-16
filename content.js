/* =========================================================
   Riaz & Sons Solution — SITE CONTENT (single source of truth)
   ---------------------------------------------------------
   EDIT THIS FILE to change text, photos, videos, contacts,
   services, projects and leadership — no other code needed.
   Or use the visual editor: open  editor.html  in a browser.
   Images go in  assets/ ; videos as YouTube Unlisted IDs.
   ========================================================= */
window.SITE_CONTENT = {
  brand: {
    name: "Riaz & Sons Solution",
    tagline: "Engineering Field Service OS",
    logo: "assets/real-logo.jpg",
  },

  hero: {
    eyebrow: "Engineering · Field Operations · Digital Monitoring",
    // Use {gold:...} to colour part of the headline.
    headline: 'Engineering Services, Field Operations & {gold:Digital Monitoring} — One Trusted Platform.',
    lead: "Riaz & Sons Solution unifies real field engineering — Lift, Genset, HVAC, Civil and Electrical — with live equipment monitoring, interactive 3D models, online booking and an operations dashboard.",
    stats: [
      { value: "1965", label: "Established" },
      { value: "27+",  label: "Projects delivered" },
      { value: "200+", label: "Elevator projects" },
      { value: "5",    label: "Offices nationwide" },
    ],
  },

  // Scrolling partner/brand strip
  partners: [
    "Mitsubishi Electric", "Orona Elevators", "Climaveneta", "RC IT Cooling",
    "TÜV Austria · ISO 9001:2015", "LeKise Lighting", "BLT Brilliant",
    "500 Solutions", "Allam Marine Generators",
  ],

  // Service department cards (icon = any emoji; gold:true gives a gold icon)
  services: [
    { icon: "🛗", gold: true,  title: "Lift / Elevator",     text: "Passenger, cargo and hospital elevators — supply, installation, commissioning, modernization and 24/7 maintenance.", tags: ["Passenger","Cargo","Hospital","AMC"] },
    { icon: "⚙️", gold: false, title: "Genset / Generator",  text: "Premium diesel generators — design, supply, on-load testing, fault diagnosis and preventive maintenance.", tags: ["Diesel","On-load test","Export"] },
    { icon: "❄️", gold: true,  title: "HVAC",                text: "Central AC, Chillers, VRF/VRV, AHU and ventilation for offices, hospitals, pharma and industrial cooling.", tags: ["Chillers","VRF/VRV","AHU"] },
    { icon: "🏗️", gold: false, title: "Civil Works",         text: "Building design, construction, finishing, tiling, paint and maintenance with quantity surveying and estimates.", tags: ["Construction","Finishing","BOQ"] },
    { icon: "⚡", gold: false, title: "Electrical Works",    text: "DB/panel work, breaker sizing, cabling, earthing and full MEP electrification — safety-first execution.", tags: ["DB / Panels","Earthing","MEP"] },
    { icon: "📐", gold: false, title: "Site Survey + Repair & Maintenance", text: "On-site measurement, technical assessment and ongoing programmed repair & maintenance for all departments.", tags: ["Survey","Inspection","24/7 AMC"] },
  ],

  // Leadership cards
  leadership: [
    { tag: "Our Founder",     image: "assets/founder-portrait.jpg", name: "Muhammad Riaz (Late) ♥", role: "Founder & Owner — Since 1965", bio: "Established Riaz & Sons Solution on the principles of integrity and professionalism. In six decades he built a unique portfolio across Generators, Elevators, Escalators and HVAC.", note: "May Allah grant him the highest place in Jannah. آمین" },
    { tag: "Our Leadership",  image: "assets/adnan-portrait.jpg",   name: "Adnan Riaz",            role: "Owner & Director — Riaz & Sons Solution", bio: "Son of the founder Muhammad Riaz (Late). Leading the next chapter — delivering reliable engineering and infrastructure across Pakistan with a nationwide field team across five offices.", note: "“Six decades of trust. A new chapter of excellence.”" },
  ],

  // Project showcase (badge: "gov" gold, "prv" blue)
  projects: [
    { image: "assets/lift-workshop.jpg",     badge: "gov", label: "Government Contract", title: "City Center Commercial Tower", text: "📍 Peshawar (PDA) — primary partner for all vertical transport systems at Peshawar's premier commercial hub.", type: "Premier Service & Installation", year: "2024" },
    { image: "assets/site-survey.jpg",       badge: "prv", label: "Active Project",      title: "Rahim Yar Khan Project",       text: "📍 RYK, Punjab — site inspection by Mr. Xen Faisal Bukhari; technical explanation by Engineer Waseem Ahmad.", type: "Technical Inspection & Commissioning", year: "2025" },
    { image: "assets/genset-panels.jpg",     badge: "prv", label: "Commercial Project",  title: "Maple Pharmaceuticals",        text: "📍 Pakistan — complete pharmaceutical-grade HVAC installation meeting strict industry standards.", type: "Complete HVAC — Pharma Grade", year: "2024" },
    { image: "assets/genset-equipment.jpg",  badge: "gov", label: "Export Contract",     title: "Industrial Generator Supply",  text: "📍 Pakistan & International — premium diesel generators inspected, packaged and delivered nationwide.", type: "Premium Diesel · Export Quality", year: "2024–25" },
    { image: "assets/field-team-panel.jpg",  badge: "prv", label: "Field Operations",    title: "Panel Build & Night Delivery", text: "📍 Nationwide — control-panel assembly, secure packaging and night-time heavy equipment delivery.", type: "Secure Packaging · On-Time", year: "2025" },
    { image: "assets/panel-work.jpg",        badge: "gov", label: "SNGPL / Institutional", title: "Lift Repair & AMC Contracts", text: "📍 Lahore & Punjab — passenger lift repair, rope handover and annual maintenance contracts.", type: "Repair · Modernization · AMC", year: "2022–23" },
  ],

  // Real photo gallery. tag: "real" (green) or "ai" (amber "AI Concept Visualization")
  gallery: [
    { image: "assets/brand-orona-lift.jpg",  tag: "real", title: "Orona Elevators",        caption: "Brand partner — installed & serviced by us" },
    { image: "assets/brand-genset.jpg",       tag: "real", title: "Allam Marine Gensets",   caption: "Brand partner — supplied & commissioned by us" },
    { image: "assets/profile-board.jpg",     tag: "real", title: "Company Profile Board", caption: "Brand & service identity" },
    { image: "assets/service-board.jpg",     tag: "real", title: "Services Board",        caption: "Civil · Electrical · Mechanical · Lift" },
    { image: "assets/org-chart.jpg",         tag: "real", title: "Organization Chart",    caption: "Real company team structure" },
    { image: "assets/genset-panels.jpg",     tag: "real", title: "Genset Control Panels", caption: "Fabricated & tested in workshop" },
    { image: "assets/field-team-panel.jpg",  tag: "real", title: "Field Team — Panel Work", caption: "On-site electrical assembly" },
    { image: "assets/civil-measurement.jpg", tag: "real", title: "Civil Measurement",     caption: "Field measurement & notes" },
    { image: "assets/site-inspection.jpg",   tag: "real", title: "Site Inspection",       caption: "Requirements walkthrough" },
    { image: "assets/lift-workshop.jpg",     tag: "real", title: "Lift / Workshop",       caption: "Technical service environment" },
    { image: "assets/clients-board.jpg",     tag: "real", title: "Client Proof",          caption: "Real clients — not fake testimonials" },
  ],

  // Videos. Leave youtube:"" to use the local mp4 (src), or paste an Unlisted ID.
  videos: [
    { title: "Company Clip 1",     note: "1.84 MB", poster: "assets/lift-workshop.jpg",    src: "assets/videos/company-video-01-VID-20260615-WA0036.mp4", youtube: "" },
    { title: "Company Clip 2",     note: "2.93 MB", poster: "assets/genset-equipment.jpg", src: "assets/videos/company-video-02-VID-20260615-WA0037.mp4", youtube: "" },
    { title: "Company Clip 3",     note: "2.37 MB", poster: "assets/panel-work.jpg",       src: "assets/videos/company-video-03-VID-20260615-WA0038.mp4", youtube: "" },
    { title: "Site Clip · 2022",   note: "0.78 MB", poster: "assets/site-survey.jpg",      src: "assets/videos/company-video-04-WhatsApp_Video_2022-07-15_at_4.01.13_PM_1_.mp4", youtube: "" },
    { title: "Field Clip · Jan 2023", note: "5.74 MB", poster: "assets/civil-measurement.jpg", src: "assets/videos/company-video-05-WhatsApp_Video_2023-01-04_at_19.31.00.mp4", youtube: "" },
    { title: "Field Clip · Mar 2023", note: "7.53 MB", poster: "assets/field-team-panel.jpg", src: "assets/videos/company-video-06-WhatsApp_Video_2023-03-30_at_14.39.26_1_.mp4", youtube: "" },
  ],
  walkthrough: { youtube: "", src: "assets/videos/company-video-01-VID-20260615-WA0036.mp4", poster: "assets/profile-board.jpg" },

  contact: {
    address: "156 Aurangzeb Block, New Garden Town, Lahore, Pakistan",
    landline: "+92 42-3595 2051",
    whatsapp: "923058967537",                 // digits only, country code first
    instagram: "riaz_and_sons_solution",
    linkedin: "riaz-sons-solution",
    website: "www.riazandsons.com",
    offices: ["Lahore", "Islamabad", "Karachi", "Multan", "Peshawar"],
  },
};
