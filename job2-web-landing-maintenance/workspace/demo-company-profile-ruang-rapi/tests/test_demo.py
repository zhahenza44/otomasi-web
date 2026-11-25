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
