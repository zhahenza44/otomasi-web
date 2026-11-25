import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
CSS = (ROOT / "css" / "styles.css").read_text(encoding="utf-8")
JS = (ROOT / "js" / "main.js").read_text(encoding="utf-8")

IMAGE_URLS = {
    "hero": "https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop",
    "project-1": "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop",
    "project-2": "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop",
    "project-3": "https://images.pexels.com/photos/6186815/pexels-photo-6186815.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop",
    "project-4": "https://images.pexels.com/photos/4409366/pexels-photo-4409366.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop",
    "project-5": "https://images.pexels.com/photos/8288956/pexels-photo-8288956.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop",
    "project-6": "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop",
    "before": "https://images.pexels.com/photos/16641359/pexels-photo-16641359.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop",
    "after": "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop",
}


class AssetMapTest(unittest.TestCase):
    def test_design_doc_lists_every_asset_role(self):
        doc = (ROOT / "DESIGN.md").read_text(encoding="utf-8")
        for role, url in IMAGE_URLS.items():
            with self.subTest(role=role):
                self.assertIn(role, doc)
                self.assertIn(url, doc)


class HtmlStructureTest(unittest.TestCase):
    def test_hero_image_is_prioritized(self):
        self.assertIn(IMAGE_URLS["hero"], HTML)
        hero_img = next(line for line in HTML.splitlines() if IMAGE_URLS["hero"] in line)
        self.assertIn('fetchpriority="high"', hero_img)
        self.assertNotIn('loading="lazy"', hero_img)
        self.assertIn('width="1200"', hero_img)
        self.assertIn('height="900"', hero_img)

    def test_six_project_cards_with_lightbox_data(self):
        self.assertEqual(HTML.count('class="project '), 6)
        for attr in ("data-project-id", "data-image", "data-title", "data-copy", "data-category"):
            self.assertEqual(HTML.count(attr), 6)

    def test_lightbox_and_sticky_cta_exist(self):
        for marker in (
            'id="project-lightbox"',
            'role="dialog"',
            'aria-modal="true"',
            'id="lightbox-image"',
            'id="lightbox-title"',
            'id="lightbox-copy"',
            'id="lightbox-close"',
            'id="lightbox-prev"',
            'id="lightbox-next"',
            'id="lightbox-wa"',
            'id="sticky-consult"',
        ):
            self.assertIn(marker, HTML)

    def test_placeholder_claims_are_removed(self):
        for phrase in ("12+", "Rina &amp; Adit", "Dewi, Kemang", "Yoga, Bekasi", "Contoh testimoni"):
            self.assertNotIn(phrase, HTML)
        self.assertIn("Contoh portofolio, foto ilustrasi", HTML)
        self.assertIn("Foto ilustrasi: Pexels", HTML)

    def test_form_has_exactly_five_fields(self):
        for name in ("nama", "wa", "layanan", "budget", "pesan"):
            self.assertIn(f'name="{name}"', HTML)
        self.assertNotIn('name="area"', HTML)
        self.assertEqual(HTML.count("<label"), 5)


class CssContractTest(unittest.TestCase):
    def test_new_components_are_styled(self):
        for marker in (
            ".project.is-featured",
            ".project-media img",
            ".lightbox[hidden]",
            ".lightbox-panel",
            ".lightbox-close",
            ".lightbox-nav",
            ".sticky-cta",
        ):
            self.assertIn(marker, CSS)

    def test_hover_and_focus_zoom_guard(self):
        self.assertIn(".project:hover .project-media img", CSS)
        self.assertIn(".project:focus-within .project-media img", CSS)
        self.assertIn("scale(1.03)", CSS)

    def test_mobile_states_are_defined(self):
        for marker in ("@media (max-width: 1024px)", "@media (max-width: 720px)", "@media (max-width: 420px)"):
            self.assertIn(marker, CSS)

    def test_reduced_motion_guard(self):
        self.assertIn("@media (prefers-reduced-motion: reduce)", CSS)
        self.assertNotIn("animation: pulse", CSS)
