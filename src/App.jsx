import { useEffect, useState } from "react";
import content from "./data.json";

// Navbar links are grouped here so they are easy to manage.
const navGroups = [
  { label: "Discover", links: [{label:"Overview", id:"about"},{label:"History", id:"history"},{label:"Types & styles", id:"styles"}] },
  { label: "Learn", links: [{label:"Techniques", id:"techniques"},{label:"Sheltering", id:"sheltering"},{label:"Hazards", id:"hazards"},{label:"Guidelines", id:"guidelines"}] },
  { label: "Explore", links: [{label:"Records", id:"records"},{label:"Clubs & map", id:"clubs"},{label:"Success stories", id:"stories"}] },
  { label: "Media", links: [{label:"Gallery", id:"gallery"},{label:"Latest updates", id:"updates"}] }
];

function SectionTitle({eyebrow, title, text}) {
  return <div className="section-heading"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{text && <p>{text}</p>}</div>;
}

function App() {
  const [active, setActive] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState("");
  const [visits, setVisits] = useState(1);
  const [clock, setClock] = useState(new Date());
  const [locationText, setLocationText] = useState("Location not shared");
  const [locationStatus, setLocationStatus] = useState("");

  // This effect counts visits in this browser and updates the clock every second.
  useEffect(() => {
    const oldCount = Number(localStorage.getItem("alpineAscentsVisits") || 0);
    const nextCount = oldCount + 1;
    localStorage.setItem("alpineAscentsVisits", String(nextCount));
    setVisits(nextCount);
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // This effect checks which section is visible while the visitor scrolls.
  useEffect(() => {
    const sections = document.querySelectorAll("main section[id]");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Close an open dropdown when the visitor clicks somewhere outside it.
  useEffect(() => {
    function closeDropdown(event) {
      if (!event.target.closest(".nav-item.dropdown")) {
        setOpenDropdown("");
      }
    }
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  // Scroll to the selected section when a navbar link is clicked.
  function goTo(id) {
    setActive(id);
    setMobileOpen(false);
    setOpenDropdown("");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Ask the visitor for location only after they press the location button.
  function shareLocation() {
    if (!navigator.geolocation) {
      setLocationStatus("Geolocation is not supported by this browser.");
      return;
    }
    setLocationStatus("Waiting for location permission…");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(3);
        const lon = position.coords.longitude.toFixed(3);
        setLocationText(`${lat}°, ${lon}°`);
        setLocationStatus("Your browser shared approximate coordinates.");
      },
      () => {
        setLocationStatus("Location permission was not granted. You can still use the website.");
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }

  const formattedDate = clock.toLocaleDateString("en-PK", { weekday:"short", day:"numeric", month:"short", year:"numeric" });
  const formattedTime = clock.toLocaleTimeString("en-PK");

  return (
    <>
      <header className="site-header">
        <nav className="navbar navbar-expand-lg">
          <div className="container nav-inner">
            <button className="brand-name" onClick={() => goTo("home")} aria-label="Go to home">Alpine <span>Ascents</span></button>
            <button className="navbar-toggler" type="button" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className={`navbar-collapse ${mobileOpen ? "show" : ""}`}>
              <ul className="navbar-nav ms-auto align-items-lg-center">
                <li className="nav-item"><button className={`nav-link ${active==="home" ? "active" : ""}`} onClick={() => goTo("home")}>Home</button></li>
                {navGroups.map((group) => (
                  <li className="nav-item dropdown" key={group.label}>
                    <button className={`nav-link dropdown-toggle ${group.links.some(link => link.id===active) ? "active" : ""}`} onClick={() => {
                      setOpenDropdown(openDropdown === group.label ? "" : group.label);
                    }} aria-expanded={openDropdown === group.label}>{group.label}</button>
                    <ul className={`dropdown-menu ${openDropdown === group.label ? "show" : ""}`}>
                      {group.links.map(link => <li key={link.id}><button className="dropdown-item" onClick={() => goTo(link.id)}>{link.label}</button></li>)}
                    </ul>
                  </li>
                ))}
                <li className="nav-item visitor-wrap">
                  <span className="visitor-mark" aria-hidden="true">▲</span>
                  <span className="visitor-label">Visitors</span>
                  <strong>{visits.toLocaleString()}</strong>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <section id="home" className="hero-section">
          <div className="hero-image"></div>
          <div className="container hero-content">
            <div className="hero-copy">
              <span className="eyebrow light-eyebrow">A guide to the high places</span>
              <h1>Find your way<br/><em>above the ordinary.</em></h1>
              <p>Explore the world of mountaineering — its history, techniques, challenges and the people who make every ascent possible.</p>
              <div className="hero-actions">
                <button className="btn btn-light rounded-pill px-4" onClick={() => goTo("about")}>Explore the guide <span>↗</span></button>
                <button className="text-link-light" onClick={() => goTo("guidelines")}>Climb safely <span>↓</span></button>
              </div>
            </div>
            <div className="hero-note"><span className="note-line"></span><span>Respect the mountain.<br/>Prepare for the journey.</span></div>
          </div>
          <div className="hero-bottom"><span>01 / 08</span><span>KNOWLEDGE · PREPARATION · ADVENTURE</span></div>
        </section>

        <section id="about" className="section-pad intro-section">
          <div className="container">
            <div className="intro-grid">
              <div><SectionTitle eyebrow="START HERE" title="The mountains are calling. Learn before you climb." /></div>
              <div className="intro-copy"><p>Mountaineering is the activity of travelling and climbing in mountainous areas. It can involve walking, scrambling, rock climbing, snow and ice travel, and high-altitude expeditions.</p><p>It is rewarding, but it also demands preparation, sound judgement and respect for changing terrain and weather. Alpine Ascents brings essential introductory information together in one place.</p><button className="inline-arrow" onClick={() => goTo("history")}>Discover its history <span>↗</span></button></div>
            </div>
            <div className="stat-strip">
              <div><strong>01</strong><span>Learn the basics</span></div><div><strong>02</strong><span>Prepare with care</span></div><div><strong>03</strong><span>Respect the outdoors</span></div><div><strong>04</strong><span>Keep exploring</span></div>
            </div>
          </div>
        </section>

        <section id="history" className="section-pad history-section">
          <div className="container split-layout">
            <div className="history-visual"><img src="/images/history-climbers.jpg" alt="Mountaineers climbing a snowy mountain ridge"/><span className="image-caption">A tradition shaped by exploration</span></div>
            <div className="section-copy"><SectionTitle eyebrow="01 — THE BEGINNING" title="A history written on the peaks" text="People have travelled through mountains for trade, exploration, science and adventure for centuries."/><p>Modern mountaineering developed as explorers and climbing groups began attempting difficult summits for achievement and discovery. In the nineteenth and twentieth centuries, improved equipment, maps and climbing knowledge helped the sport grow.</p><p>Today, mountaineering includes many different activities, from guided walks to technical high-altitude expeditions. The spirit of preparation and teamwork remains important.</p></div>
          </div>
        </section>

        <section id="styles" className="section-pad styles-section">
          <div className="container">
            <SectionTitle eyebrow="02 — FIND YOUR STYLE" title="Different paths. One mountain spirit." text="Mountaineering includes several styles. The right choice depends on terrain, experience, conditions and preparation."/>
            <div className="style-grid">
              <article className="style-card"><img src="/images/style-hiking.jpg" alt="Hiker walking along a rocky alpine trail"/><div><span>01 / TREKKING</span><h3>Hiking & trekking</h3><p>Walking established trails and mountain routes, usually without technical climbing equipment.</p></div></article>
              <article className="style-card"><img src="/images/style-rock.jpg" alt="Climber ascending a steep rock face"/><div><span>02 / ROCK</span><h3>Rock climbing</h3><p>Moving over rock using hands, feet, ropes and protection systems appropriate to the route.</p></div></article>
              <article className="style-card"><img src="/images/glacier.jpg" alt="Snowy glacier surrounded by high mountain peaks"/><div><span>03 / ALPINE</span><h3>Alpine climbing</h3><p>Travelling across mixed mountain terrain that may include rock, snow, ice and glaciers.</p></div></article>
            </div>
          </div>
        </section>

        <section id="techniques" className="section-pad techniques-section">
          <div className="container">
            <div className="tech-top"><SectionTitle eyebrow="03 — BUILD YOUR SKILLS" title="Good technique starts with good habits." text="Skills should be learned with qualified instruction and practised in suitable, controlled conditions."/></div>
            <div className="tech-grid">
              <div className="tech-item"><span>01</span><div><h3>Footwork & balance</h3><p>Use stable steps, keep your centre of balance controlled and avoid rushing on uneven ground.</p></div></div>
              <div className="tech-item"><span>02</span><div><h3>Rope awareness</h3><p>Understand basic rope care, communication and equipment checks through supervised training.</p></div></div>
              <div className="tech-item"><span>03</span><div><h3>Route planning</h3><p>Study maps, identify hazards, check weather and agree on a realistic turnaround time.</p></div></div>
              <div className="tech-item"><span>04</span><div><h3>Team communication</h3><p>Share plans clearly, check on teammates and speak up when conditions or energy levels change.</p></div></div>
            </div>
          </div>
        </section>

        <section id="sheltering" className="section-pad shelter-section">
          <div className="container shelter-grid">
            <div className="section-copy"><SectionTitle eyebrow="04 — STAY PROTECTED" title="Shelter is part of the plan." text="A suitable shelter protects climbers from wind, rain, cold and exposure during a mountain journey."/><p>Choose a campsite away from avalanche paths, falling rocks, exposed ridgelines and areas where water may collect. Follow local rules and avoid damaging fragile vegetation.</p><p>Carry shelter suited to the route, season and group size. Practise setting it up before the trip, and always have a backup plan if conditions become unsafe.</p></div>
            <img className="shelter-image" src="/images/snow-shelter.jpg" alt="Mountaineers resting beside a snow shelter in the mountains"/>
          </div>
        </section>

        <section id="hazards" className="section-pad hazards-section">
          <div className="container">
            <SectionTitle eyebrow="05 — KNOW THE RISKS" title="The mountain deserves your attention." text="Conditions can change quickly. Recognising hazards early helps climbers make safer decisions."/>
            <div className="hazard-grid">
              <div className="hazard-card"><span>01</span><h3>Altitude sickness</h3><p>High altitude can affect the body. Ascend gradually, understand warning signs and seek help if symptoms worsen.</p></div>
              <div className="hazard-card"><span>02</span><h3>Weather changes</h3><p>Storms, strong winds, snow and sudden temperature drops can make a route dangerous.</p></div>
              <div className="hazard-card"><span>03</span><h3>Falls & loose rock</h3><p>Unstable surfaces and exposed terrain require careful movement, suitable equipment and training.</p></div>
              <div className="hazard-card"><span>04</span><h3>Avalanches & ice</h3><p>Snow slopes and glaciers have serious hazards. Travel only with the right skills and expert guidance.</p></div>
            </div>
          </div>
        </section>

        <section id="records" className="section-pad records-section">
          <div className="container">
            <SectionTitle eyebrow="06 — MOUNTAIN MILESTONES" title="A few remarkable high points" text="Selected facts about some of the world's best-known mountains."/>
            <div className="record-grid">{content.records.map((record, i) => <article className="record-card" key={record.name}><span>0{i+1} / MOUNTAIN RECORD</span><h3>{record.name}</h3><strong>{record.value}</strong><p>{record.detail}</p><small>{record.place}</small></article>)}</div>
            <p className="small-note">Heights are commonly cited figures. Measurements and published records can be updated by relevant authorities.</p>
          </div>
        </section>

        <section id="clubs" className="section-pad clubs-section">
          <div className="container">
            <SectionTitle eyebrow="07 — MOUNTAIN COMMUNITY" title="People who bring climbers together." text="Mountaineering clubs help people learn, meet other climbers and find information about training and expeditions. Here is one organisation connected with Pakistan's mountain community."/>

            <div className="community-feature">
              <div className="community-photo">
                <img src="/images/basecamp.jpg" alt="Mountaineering tents at a high mountain base camp" />
                <span>PAKISTAN / MOUNTAIN COMMUNITY</span>
              </div>
              <div className="community-info">
                <span className="community-number">01 / FEATURED ORGANISATION</span>
                <h3>Alpine Club of Pakistan</h3>
                <p>The Alpine Club of Pakistan promotes mountaineering and climbing activities in the country. Its work includes training, expeditions and support for people interested in mountain sports.</p>
                <div className="activity-tags"><span>Training</span><span>Expeditions</span><span>Climbing</span><span>Rescue courses</span></div>
                <small>Based in Islamabad, Pakistan</small>
              </div>
            </div>

            <div className="community-bottom">
              <div className="region-notes">
                <span className="community-number">MOUNTAIN AREAS</span>
                <h3>Where many journeys begin</h3>
                <p>Pakistan has several well-known mountain regions. Visitors can explore these areas on the map and learn about the communities and climbing opportunities around them.</p>
                <div className="region-list">
                  <div><b>01</b><span><strong>Gilgit-Baltistan</strong><small>Karakoram peaks and high-altitude routes</small></span></div>
                  <div><b>02</b><span><strong>Hunza & Nagar</strong><small>Mountain valleys and trekking areas</small></span></div>
                  <div><b>03</b><span><strong>Skardu</strong><small>A starting point for many mountain journeys</small></span></div>
                </div>
              </div>
              <div className="map-panel">
                <div className="map-label">NORTHERN PAKISTAN / MAP VIEW</div>
                <iframe title="Map of northern Pakistan mountain region" src="https://www.openstreetmap.org/export/embed.html?bbox=70.2%2C34.0%2C77.8%2C37.8&layer=mapnik" loading="lazy"></iframe>
                <p>Map view of northern Pakistan. An internet connection is needed to load the map.</p>
              </div>
            </div>

            <div className="location-box"><div><strong>Find your current location</strong><p>{locationText}</p><small>{locationStatus || "Press the button if you want the browser to share your approximate coordinates."}</small></div><button className="btn btn-dark rounded-pill px-4" onClick={shareLocation}>Share my location</button></div>
          </div>
        </section>

        <section id="stories" className="section-pad stories-section">
          <div className="container story-layout">
            <div><SectionTitle eyebrow="08 — TEAMWORK & COURAGE" title="Every summit has a story." text="Successful expeditions are built on preparation, teamwork and careful decisions — not just reaching the top."/></div>
            <div className="story-stack">
              <div className="story-card"><span>EXPEDITION LESSON 01</span><h3>The value of turning back</h3><p>A climbing team may reach a point where weather, fatigue or route conditions make continuing unsafe. Choosing to turn back can protect the whole team and is an important part of responsible mountaineering.</p><div className="story-footer">A safe return is also a successful outcome.</div></div>
              <div className="story-card"><span>EXPEDITION LESSON 02</span><h3>Teamwork at base camp</h3><p>Organised expeditions depend on shared responsibilities: checking equipment, planning meals, monitoring weather and supporting teammates throughout the journey.</p><div className="story-footer">Preparation is a team achievement.</div></div>
            </div>
          </div>
        </section>

        <section id="gallery" className="section-pad gallery-section">
          <div className="container">
            <SectionTitle eyebrow="09 — VISUAL JOURNAL" title="A closer look at mountain life." text="A collection of mountain photographs and external video resources for learning more about mountaineering."/>
            <div className="gallery-grid">
              <figure><img src="/images/hero-mountain.jpg" alt="Sunrise over a mountain range"/><figcaption>First light on the ridge</figcaption></figure>
              <figure><img src="/images/glacier.jpg" alt="A wide glacier valley between snowy peaks"/><figcaption>Across the glacier valley</figcaption></figure>
              <figure><img src="/images/basecamp.jpg" alt="A mountain expedition base camp"/><figcaption>Life at base camp</figcaption></figure>
              <figure><img src="/images/summit-hiker.jpg" alt="A mountaineer looking across the mountain range"/><figcaption>The view from the summit</figcaption></figure>
              <figure><img src="/images/alpine-lake.jpg" alt="A clear alpine lake reflecting snowy peaks"/><figcaption>Still waters beneath the peaks</figcaption></figure>
            </div>
            <div className="video-row">
              <a href="https://www.youtube.com/results?search_query=mountaineering+basics+for+beginners" target="_blank" rel="noreferrer" className="video-card"><span className="play">▶</span><div><small>VIDEO RESOURCE 01</small><h3>Mountaineering basics for beginners</h3><p>Search for beginner-friendly learning videos on YouTube ↗</p></div></a>
              <a href="https://www.youtube.com/results?search_query=mountain+safety+and+weather+education" target="_blank" rel="noreferrer" className="video-card"><span className="play">▶</span><div><small>VIDEO RESOURCE 02</small><h3>Mountain safety and weather</h3><p>Search for mountain safety and weather videos on YouTube ↗</p></div></a>
            </div>
          </div>
        </section>

        <section id="updates" className="section-pad updates-section">
          <div className="container">
            <SectionTitle eyebrow="10 — KEEP LEARNING" title="Notes from the climbing world" text="A separate learning section with useful developments and topics to follow. These are general educational notes, not a live news feed."/>
            <div className="updates-grid">{content.updates.map((item, i) => <article className="update-card" key={item.title}><span>{item.tag} / 0{i+1}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
          </div>
        </section>

        <section id="guidelines" className="section-pad guidelines-section">
          <div className="container guidelines-layout">
            <div><SectionTitle eyebrow="11 — BEFORE YOU GO" title="A few guidelines worth keeping." text="Use this checklist as a starting point. Always follow local regulations and qualified professional advice."/></div>
            <div className="guideline-list">
              {["Choose a route suitable for your experience and fitness.","Check the latest weather and local mountain conditions.","Tell someone your route and expected return time.","Carry suitable clothing, food, water and emergency equipment.","Travel with trained partners and use qualified guides when needed.","Respect wildlife, local communities and fragile environments.","Turn back when conditions or team safety require it."].map((item, i) => <div className="guideline" key={item}><span>0{i+1}</span><p>{item}</p></div>)}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-top"><div><div className="footer-brand">Alpine <span>Ascents</span></div><p>Learn about the mountains. Prepare with respect.</p></div><button onClick={() => goTo("home")} className="back-top">Back to top ↑</button></div>
        <div className="container footer-bottom"><span>© {new Date().getFullYear()} Alpine Ascents · Student E-Project</span><span>Explore responsibly. Leave no trace.</span></div>
      </footer>

      <div className="ticker"><span className="ticker-dot"></span><strong>ALPINE ASCENTS</strong><span>{formattedDate}</span><span>{formattedTime}</span><span>LOCATION: {locationText}</span><span className="ticker-message">MOUNTAINS ARE FOR EVERYONE — PREPARE, RESPECT, EXPLORE</span></div>
    </>
  );
}

export default App;