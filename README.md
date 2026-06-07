# 🗺️ Learning Map

A personal curated learning hub documenting my journey across **Web Development**, **Cybersecurity**, **Networking**, and **Ethical Hacking**. Not another course platform — just honest reviews, curated resources, and interactive tools based on what I've actually used.

**[Live Site](https://saiaikkwan.com/learningmap/)** · **[Portfolio](https://saiaikkwan.com)**

---

## 📸 Screenshots

![Homepage Screenshot](screenshot-home.png)

---

## 🎯 What This Is

- A **curated resource directory** with personal ratings and honest notes
- A **learning timeline** showing my progression across four skill tracks
- **Interactive tools** — password strength checker, Caesar cipher lab, phishing email quiz
- **Quiz system** for testing knowledge in each track
- **Platform comparison tables** for side-by-side evaluation

## ❌ What This Isn't

- A course or tutorial site — I'm not teaching, I'm sharing what I've used
- Sponsored content — every review is my honest opinion
- A replacement for TryHackMe, freeCodeCamp, or any other platform — I link to them

---

## 🗂️ Project Structure

```
learningmap/
├── index.html                      # Homepage with overview & cross-skill diagram
├── my-journey.html                 # Personal learning timeline
├── css/
│   └── style.css                   # Complete stylesheet (dark/light theme)
├── js/
│   ├── main.js                     # Core functionality (theme, nav, search)
│   ├── quiz-engine.js              # Reusable quiz system
│   └── progress.js                 # localStorage progress tracking
├── data/
│   ├── resources.json              # All curated resources
│   ├── quizzes.json                # Quiz questions for each track
│   └── timeline.json               # Learning journey entries
├── web-development/                # 🌐 Web Development track
│   ├── index.html                  # Track overview
│   ├── frontend.html               # Frontend resources
│   ├── backend.html                # Backend resources
│   └── quiz.html                   # Web dev quiz
├── cybersecurity/                  # 🔒 Cybersecurity track
│   ├── index.html
│   ├── fundamentals.html
│   ├── network-security.html
│   └── quiz.html
├── networking/                     # 📡 Networking track
│   ├── index.html
│   ├── fundamentals.html
│   ├── cisco.html
│   └── quiz.html
├── ethical-hacking/                # 🎯 Ethical Hacking track
│   ├── index.html
│   ├── platforms.html
│   ├── tools.html
│   └── quiz.html
├── resources/                      # 📚 Resource directory
│   ├── index.html                  # All resources with search & filter
│   └── comparison.html             # Platform comparison tables
└── tools/                          # 🛠️ Interactive tools
    ├── index.html
    ├── password-checker.html
    ├── cipher-lab.html
    └── phishing-quiz.html
```

---

## ✨ Features

### 📱 Responsive Design
- Clean layout on desktop, tablet, and mobile
- Sidebar navigation on track pages (collapses to horizontal scroll on mobile)
- Dropdown menus for compact main navigation

### 🌓 Dark/Light Theme
- Toggle between dark and light mode
- Preference saved to `localStorage`
- Green accent color throughout (cybersecurity/terminal aesthetic)

### 📚 Resource System
- Resources stored as JSON — add new ones without touching HTML
- Filter by track, cost (free/paid), level, and completion status
- Search across names, topics, notes, and categories
- Personal ratings (1-5 stars) and honest review notes

### 📝 Quiz Engine
- Reusable `QuizEngine` class — instantiate any quiz with a JSON of questions
- Score tracking with `localStorage` persistence
- Progress bars on homepage update based on quiz results
- Works across all 4 tracks

### 🛠️ Interactive Tools
- **Password Strength Checker** — estimates crack time based on entropy
- **Caesar Cipher Lab** — encrypt/decrypt with configurable shift
- **Phishing Email Quiz** — identify real vs phishing emails with explanations

### 🗺️ Learning Timeline
- Visual timeline of my learning journey
- Data-driven from `timeline.json` — easy to update

### 🔍 Search & Filter
- Full-text search across all resources
- Tab-based filtering by track, cost, and status

---

## 🚀 Getting Started

### Prerequisites
Nothing — it's static HTML, CSS, and JavaScript. No build tools, no frameworks, no dependencies (except Font Awesome CDN).

### Local Development
```bash
# Clone the repo
git clone https://github.com/saiaikkwan/cybersec-learning-hub.git

# Navigate to the folder
cd cybersec-learning-hub

# Open in browser or use any static server
# Option 1: Open directly
open index.html

# Option 2: Use Python's built-in server
python3 -m http.server 8080

# Option 3: Use VS Code Live Server extension
```

### Deployment
Drop the `learningmap/` folder into any static hosting:
- **GitHub Pages** — push to `saiaikkwan.github.io/learningmap/`
- **Netlify** — drag and drop
- **Vercel** — connect repo
- **Any shared hosting** — upload via FTP

---

## 🎨 Customization

### Adding a New Resource
Edit `data/resources.json` and add an entry:
```json
{
    "name": "Resource Name",
    "type": "Course / Platform / Book / Video",
    "url": "https://example.com",
    "cost": "Free",
    "level": "Beginner",
    "rating": 5,
    "timeEstimate": "20 hours",
    "note": "Your honest review here.",
    "topics": ["Topic1", "Topic2"],
    "status": "in-progress"
}
```

### Adding Quiz Questions
Edit `data/quizzes.json` and add to the appropriate track:
```json
{
    "question": "Your question?",
    "options": ["A", "B", "C", "D"],
    "correct": 0,
    "explanation": "Why this answer is correct."
}
```

### Changing Colors
Edit the CSS variables at the top of `css/style.css`:
```css
:root {
    --primary: #00ff88;      /* Main accent color */
    --primary-dark: #00cc6a; /* Darker variant */
    --accent: #64ffda;       /* Secondary accent */
    /* ... */
}
```

### Adding a Timeline Entry
Edit `data/timeline.json`:
```json
{
    "date": "Late 2024",
    "title": "What you achieved",
    "description": "A few sentences about what you learned.",
    "skills": ["Skill1", "Skill2"],
    "resources": ["Resource used"]
}
```

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|------------|
| **Structure** | HTML5 |
| **Styling** | CSS3 (Custom Properties, Grid, Flexbox) |
| **Interactivity** | Vanilla JavaScript (ES6+) |
| **Icons** | Font Awesome 6.5 (CDN) |
| **Data** | JSON files |
| **Storage** | `localStorage` for theme & progress |
| **Hosting** | GitHub Pages / Static hosting |

---

## 📊 Project Stats

| Metric | Count |
|--------|-------|
| **HTML Pages** | 24 |
| **CSS Lines** | ~1,200 |
| **JS Files** | 3 |
| **Skill Tracks** | 4 |
| **Interactive Tools** | 3 |
| **Quiz Questions** | 20+ |
| **Curated Resources** | 20+ |

---

## 🔮 Future Plans

- [ ] Add more resources (target: 50+)
- [ ] Expand quiz questions (target: 15 per track)
- [ ] Add a glossary of cybersecurity/networking terms
- [ ] Printable cheat sheets for each track
- [ ] RSS feed for timeline updates
- [ ] Convert to 11ty SSG for easier content management

---

## 📄 License

This project is for educational purposes. Feel free to fork and adapt for your own learning journey.

---

## 🙋‍♂️ About Me

**Sai Aik Kwan** — Developer, learner, and builder.

- 🌐 [Portfolio](https://saiaikkwan.com)
- 💻 [GitHub](https://github.com/saiaikkwan)

---

*Last updated: 2026*
