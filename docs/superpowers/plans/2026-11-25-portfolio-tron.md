# Portfolio TRON Alan Nawa Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a one-page TRON-styled web CV for Alan Nawa with seven demo cards and Instagram/GitHub/email contact.

**Architecture:** A single static HTML page with hardcoded content, one CSS file for the TRON visual system, and one small JS file for filtering and the mobile menu. No build, no framework, no external assets; Python unittest reads the files as text to pin the content and interface contracts.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Python 3 unittest, Git + GitHub CLI.

**Spec:** `docs/superpowers/specs/2026-11-25-portfolio-tron-design.md`

## Global Constraints

- Project root: `/home/asnodt/Projects/Portofolio/` (new folder).
- Name: `Alan Nawa`. Intro copy verbatim: "Halo, saya Alan Nawa, not-a-dev :) Saya bisa bantu bikin website yang rapi dan workflow yang otomatis, supaya bisnis Anda lebih cepat merespons pelanggan."
- Contact: Instagram `@zhahenzar` (`https://instagram.com/zhahenzar`), email `zhahenza666@proton.me`, GitHub `https://github.com/zhahenza44`.
- Forbidden everywhere: WhatsApp/`wa.me`, `projects.co.id`.
- Seven cards: AI lead capture, servis AC, Ruang Rapi, kedai kopi, rental mobil, Omegamoto, portfolio cyberpunk.
- Omegamoto: no link, not pushed to GitHub. Cyberpunk: link and push to GitHub.
- No dependency, no build step, no external font or image requests.

## Review Focus

- Long email/contact text at 390 px must not overflow: Task 2 test `test_narrow_viewport_guard`.
- Seven cards must survive with JS disabled: Task 1 test `test_seven_project_cards` reads static HTML.
- No stale WhatsApp or marketplace contact path anywhere: Task 1 `test_forbidden_contact`, Task 3 `test_no_whatsapp_in_js`.
- Omegamoto must never become a broken link: Task 1 `test_omegamoto_has_no_link`.
- Filter state must stay understandable by keyboard and screen reader: Task 3 `test_filter_controls_semantics`.

---

### Task 1: Page content and structure

**Files:**
- Create: `/home/asnodt/Projects/Portofolio/index.html`
- Create: `/home/asnodt/Projects/Portofolio/assets/favicon.svg`
- Create: `/home/asnodt/Projects/Portofolio/tests/test_portfolio.py`
- Create: `/home/asnodt/Projects/Portofolio/.gitignore` (ignore `__pycache__/`)

**Interfaces:**
- Produces: `#project-grid`, `.project-card[data-track="job1|job2"]`, `#filter-all`, `#filter-job1`, `#filter-job2`, `#menu-toggle`, `#mobile-menu`, `#contact`, `.skip-link`; `index.html` links `css/styles.css` and defers `js/main.js`.

- [ ] **Step 1: Write the failing content tests**

```python
class ContentTest(unittest.TestCase):
    def test_identity_and_copy(self):
        self.assertIn("Alan Nawa", HTML)
        self.assertIn("Halo, saya Alan Nawa, not-a-dev :)", HTML)
        self.assertIn("https://instagram.com/zhahenzar", HTML)
        self.assertIn("zhahenza666@proton.me", HTML)
        self.assertIn("https://github.com/zhahenza44", HTML)

    def test_seven_project_cards(self):
        self.assertEqual(HTML.count('class="project-card'), 7)
        for title in ("AI Lead Capture", "Servis AC", "Ruang Rapi", "Kedai Kopi Oak",
                      "Rental Mobil", "Omegamoto", "NIGHT//SHIFT"):
            with self.subTest(title=title):
                self.assertIn(title, HTML)

    def test_omegamoto_has_no_link(self):
        card = re.search(r'<article class="project-card"[^>]*data-project="omegamoto".*?</article>', HTML, re.S)
        self.assertIsNotNone(card)
        self.assertNotIn("href=", card.group(0))

    def test_link_targets(self):
        for path in (
            "job1-otomasi-ai-workflow/workspace/demo-ai-lead-capture",
            "job2-web-landing-maintenance/workspace/demo-landingpage-servis-ac",
            "job2-web-landing-maintenance/workspace/demo-company-profile-ruang-rapi",
            "job2-web-landing-maintenance/workspace/demo-landingpage-kedai-kopi",
            "job2-web-landing-maintenance/workspace/demo-rental-mobil-multipage",
            "job2-web-landing-maintenance/workspace/demo-portfolio-cyberpunk",
        ):
            with self.subTest(path=path):
                self.assertIn(f"https://github.com/zhahenza44/otomasi-web/tree/main/{path}", HTML)

    def test_forbidden_contact(self):
        for phrase in ("wa.me", "whatsapp", "projects.co.id"):
            self.assertNotIn(phrase, HTML.lower())

    def test_sections_and_controls(self):
        for marker in ('class="skip-link"', 'id="project-grid"', 'id="filter-all"',
                       'id="filter-job1"', 'id="filter-job2"', 'id="menu-toggle"',
                       'id="mobile-menu"', 'id="contact"', "<main", "<footer"):
            self.assertIn(marker, HTML)
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd /home/asnodt/Projects/Portofolio && python3 -m unittest discover -s tests -v`
Expected: FAIL because `index.html` does not exist.

- [ ] **Step 3: Create the static page**

Write `index.html` with: header containing the name, Instagram/GitHub/email links and `#menu-toggle`; a single opening section with the exact intro copy and exactly two buttons (`[Lihat project]` → `#project-grid`, `[Instagram]` → Instagram URL); two service blocks (Job 1 otomasi AI/n8n, Job 2 web/landing); `#project-grid` with seven `<article class="project-card" data-track="..." data-project="...">` cards, each with title, one-line description, tag labels and a GitHub link except Omegamoto; filter buttons; `#contact` with the three contact links; footer with a GitHub repo link. Add `<link rel="stylesheet" href="css/styles.css">`, `<script src="js/main.js" defer></script>`, `lang="id"`, a meta description, and `assets/favicon.svg` as a small cyan grid mark.

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd /home/asnodt/Projects/Portofolio && python3 -m unittest discover -s tests -v`
Expected: all `ContentTest` tests PASS.

- [ ] **Step 5: Commit**

```bash
cd /home/asnodt/Projects/Portofolio && git init -q && git add .gitignore index.html assets/favicon.svg tests/test_portfolio.py && git commit -q -m "feat: add portfolio page content and seven demo cards"
```

### Task 2: TRON visual system and responsive layout

**Files:**
- Create: `/home/asnodt/Projects/Portofolio/css/styles.css`
- Test: `/home/asnodt/Projects/Portofolio/tests/test_portfolio.py` (append `CssContractTest`)

**Interfaces:**
- Consumes: class names and IDs from Task 1.
- Produces: CSS custom properties `--bg`, `--cyan`, `--orange`, `--line`; classes `.tron-grid`, `.scanline`, `.project-grid`.

- [ ] **Step 1: Write the failing CSS tests**

```python
class CssContractTest(unittest.TestCase):
    def test_tron_tokens(self):
        for token in ("--bg:", "--cyan:", "--orange:", "--line:", "color-scheme: dark"):
            self.assertIn(token, CSS)

    def test_grid_and_scanline(self):
        for marker in (".tron-grid", ".scanline", "@keyframes"):
            self.assertIn(marker, CSS)

    def test_responsive_reflow(self):
        for marker in ("@media (max-width: 900px)", "@media (max-width: 560px)", "grid-template-columns"):
            self.assertIn(marker, CSS)
        self.assertIn(".project-grid {", CSS)

    def test_narrow_viewport_guard(self):
        self.assertIn("overflow-wrap: anywhere", CSS)
        self.assertIn("min-width: 0", CSS)

    def test_reduced_motion_and_focus(self):
        self.assertIn("@media (prefers-reduced-motion: reduce)", CSS)
        self.assertIn("animation: none", CSS)
        self.assertIn(":focus-visible", CSS)

    def test_no_external_assets(self):
        self.assertNotIn("http", CSS)
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd /home/asnodt/Projects/Portofolio && python3 -m unittest discover -s tests -v`
Expected: FAIL on every `CssContractTest` assertion.

- [ ] **Step 3: Write the stylesheet**

Near-black background, cyan primary and orange secondary accents, perspective grid and faint scanline built from CSS gradients only, system mono stack for labels (`ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`) and system sans for body. One section per screen at desktop: opening, services, projects, contact. Two-column project grid at desktop, one column at 900 px, larger tap targets and stacked header at 560 px. Hover lifts cards 2 px; `:focus-visible` draws a cyan outline; `prefers-reduced-motion` removes animation. Keep email/URL text wrapping intact.

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd /home/asnodt/Projects/Portofolio && python3 -m unittest discover -s tests -v`
Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
cd /home/asnodt/Projects/Portofolio && git add css/styles.css tests/test_portfolio.py && git commit -q -m "feat: style portfolio with TRON grid and responsive layout"
```

### Task 3: Filtering and mobile menu behaviour

**Files:**
- Create: `/home/asnodt/Projects/Portofolio/js/main.js`
- Modify: `/home/asnodt/Projects/Portofolio/tests/test_portfolio.py` (append `InteractionTest`)

**Interfaces:**
- Consumes: `#filter-all`, `#filter-job1`, `#filter-job2`, `.project-card[data-track]`, `#menu-toggle`, `#mobile-menu` from Task 1.
- Produces: `applyFilter(track)`; cards toggled with `hidden`; filter buttons with `aria-pressed`.

- [ ] **Step 1: Write the failing interaction tests**

```python
class InteractionTest(unittest.TestCase):
    def test_filter_controls_semantics(self):
        for marker in ('aria-pressed="true"', 'data-filter="all"', 'data-filter="job1"',
                       'data-filter="job2"', 'role="group"'):
            self.assertIn(marker, HTML)

    def test_filter_logic_markers(self):
        for marker in ("function applyFilter", "card.dataset.track", "card.hidden",
                       "setAttribute('aria-pressed'", "filterButtons"):
            self.assertIn(marker, JS)

    def test_mobile_menu_markers(self):
        for marker in ("menuToggle", "aria-expanded", "event.key === 'Escape'", "inert"):
            self.assertIn(marker, JS)

    def test_no_whatsapp_in_js(self):
        self.assertNotIn("whatsapp", JS.lower())
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd /home/asnodt/Projects/Portofolio && python3 -m unittest discover -s tests -v`
Expected: FAIL on all `InteractionTest` assertions.

- [ ] **Step 3: Implement the interactions**

In `js/main.js`, implement `applyFilter(track)`: hide every `.project-card` whose `data-track` does not match, unless track is `all`; update `aria-pressed` on `#filter-all`, `#filter-job1`, `#filter-job2`. Wire `click` handlers on those buttons. Wire `#menu-toggle` to toggle `#mobile-menu` visibility and `aria-expanded`; close it on Escape and on link click; keep it `inert` while closed.

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd /home/asnodt/Projects/Portofolio && python3 -m unittest discover -s tests -v`
Expected: all tests PASS. Then open `index.html` in a browser and confirm each filter leaves 7 / 1 / 6 cards visible.

- [ ] **Step 5: Commit**

```bash
cd /home/asnodt/Projects/Portofolio && git add js/main.js tests/test_portfolio.py && git commit -q -m "feat: add project filter and mobile menu"
```

### Task 4: Publish the cyberpunk demo and deliver

**Files:**
- Modify: `/home/asnodt/Projects/Freelance-Otomasi-Web/docs/superpowers/specs/2026-11-25-portfolio-tron-design.md` (already created; commit it)
- Modify: `/home/asnodt/Projects/Freelance-Otomasi-Web/docs/superpowers/plans/2026-11-25-portfolio-tron.md` (this plan; commit it)
- Create: `/home/asnodt/Projects/Portofolio/README.md`

**Interfaces:**
- Consumes: the working page from Tasks 1-3.

- [ ] **Step 1: Write the failing delivery test**

```python
class DeliveryTest(unittest.TestCase):
    def test_readme_has_no_forbidden_contacts(self):
        readme = (ROOT / "README.md").read_text(encoding="utf-8")
        for phrase in ("wa.me", "whatsapp", "projects.co.id"):
            self.assertNotIn(phrase, readme.lower())
        self.assertIn("index.html", readme)

    def test_full_content(self):
        self.assertEqual(HTML.count('class="project-card'), 7)
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd /home/asnodt/Projects/Portofolio && python3 -m unittest discover -s tests -v`
Expected: FAIL because `README.md` does not exist.

- [ ] **Step 3: Write README and publish the demo**

Write a short README naming the project, how to open `index.html`, where contact details are set, and which repo/demo folders back the cards. In `/home/asnodt/Projects/Freelance-Otomasi-Web`, stage and commit only `job2-web-landing-maintenance/workspace/demo-portfolio-cyberpunk/` plus the two `docs/superpowers/` files, then push `main`. Do not stage the Omegamoto folder.

- [ ] **Step 4: Verify everything**

```bash
cd /home/asnodt/Projects/Portofolio && python3 -m unittest discover -s tests -v
git -C /home/asnodt/Projects/Freelance-Otomasi-Web status --short
gh api -H "Accept: application/vnd.github.raw+json" "repos/zhahenza44/otomasi-web/contents/job2-web-landing-maintenance/workspace/demo-portfolio-cyberpunk/index.html" --jq '.name'
```
Expected: tests PASS, Omegamoto still untracked, cyberpunk `index.html` present on GitHub.

- [ ] **Step 5: Commit the portfolio README**

```bash
cd /home/asnodt/Projects/Portofolio && git add README.md tests/test_portfolio.py && git commit -q -m "docs: add portfolio readme and delivery checks"
```
