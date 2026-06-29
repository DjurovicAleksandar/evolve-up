#!/usr/bin/env python3
import csv
import json
import re
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlparse, urlunparse
from urllib.request import Request, urlopen


BASE = "https://evolveup-consulting.com"
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "outputs"
WORK = ROOT / "work"
UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"
)


def norm_ws(value: str) -> str:
    return re.sub(r"\s+", " ", unescape(value or "")).strip()


def strip_tags(html: str) -> str:
    parser = TextExtractor()
    parser.feed(html or "")
    return "\n".join(parser.text_blocks)


def normalize_url(url: str) -> str:
    parsed = urlparse(url)
    scheme = "https" if parsed.scheme in {"", "http", "https"} else parsed.scheme
    netloc = parsed.netloc.lower()
    path = parsed.path or "/"
    if not path.endswith("/") and "." not in path.rsplit("/", 1)[-1]:
        path += "/"
    return urlunparse((scheme, netloc, path, "", "", ""))


def fetch(url: str, accept: str = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8") -> tuple[int, str, dict[str, str]]:
    req = Request(url, headers={"User-Agent": UA, "Accept": accept})
    try:
        with urlopen(req, timeout=30) as resp:
            data = resp.read()
            charset = resp.headers.get_content_charset() or "utf-8"
            return resp.status, data.decode(charset, errors="replace"), dict(resp.headers)
    except HTTPError as exc:
        data = exc.read()
        return exc.code, data.decode("utf-8", errors="replace"), dict(exc.headers)
    except URLError as exc:
        return 0, str(exc), {}


def fetch_json(url: str) -> tuple[Any, dict[str, str]]:
    status, body, headers = fetch(url, "application/json,*/*;q=0.8")
    if status >= 400 or status == 0:
        return {"error": body, "status": status}, headers
    return json.loads(body), headers


def wp_all(endpoint: str) -> list[dict[str, Any]]:
    items: list[dict[str, Any]] = []
    page = 1
    while True:
        sep = "&" if "?" in endpoint else "?"
        data, headers = fetch_json(f"{BASE}/wp-json/wp/v2/{endpoint}{sep}per_page=100&page={page}")
        if isinstance(data, dict) and data.get("error"):
            break
        items.extend(data)
        total_pages = int(headers.get("X-WP-TotalPages", "1") or "1")
        if page >= total_pages:
            break
        page += 1
        time.sleep(0.15)
    return items


@dataclass
class TextExtractor(HTMLParser):
    title: str = ""
    meta: dict[str, str] = field(default_factory=dict)
    headings: list[dict[str, str]] = field(default_factory=list)
    text_blocks: list[str] = field(default_factory=list)
    links: list[dict[str, str]] = field(default_factory=list)
    images: list[dict[str, str]] = field(default_factory=list)
    iframes: list[dict[str, str]] = field(default_factory=list)
    forms: list[dict[str, str]] = field(default_factory=list)

    _skip_depth: int = 0
    _tag_stack: list[str] = field(default_factory=list)
    _capture: list[tuple[str, list[str], dict[str, str]]] = field(default_factory=list)

    block_tags = {"p", "li", "blockquote", "figcaption", "button"}
    heading_tags = {"h1", "h2", "h3", "h4", "h5", "h6"}
    skip_tags = {"script", "style", "svg", "noscript"}

    def __post_init__(self) -> None:
        HTMLParser.__init__(self)

    def handle_starttag(self, tag: str, attrs_list: list[tuple[str, str | None]]) -> None:
        attrs = {k.lower(): v or "" for k, v in attrs_list}
        self._tag_stack.append(tag)
        if tag in self.skip_tags:
            self._skip_depth += 1
            return
        if tag == "title":
            self._capture.append((tag, [], attrs))
        elif tag in self.heading_tags or tag in self.block_tags or tag == "a":
            self._capture.append((tag, [], attrs))
        elif tag == "meta":
            key = attrs.get("name") or attrs.get("property")
            if key and attrs.get("content"):
                self.meta[key] = norm_ws(attrs["content"])
        elif tag == "link" and attrs.get("rel") and attrs.get("href"):
            rel = attrs["rel"].lower()
            if "canonical" in rel:
                self.meta["canonical"] = attrs["href"]
        elif tag == "img":
            src = attrs.get("src") or attrs.get("data-src") or attrs.get("data-lazy-src")
            if src:
                self.images.append(
                    {
                        "src": src,
                        "alt": norm_ws(attrs.get("alt", "")),
                        "title": norm_ws(attrs.get("title", "")),
                    }
                )
        elif tag == "iframe":
            self.iframes.append(
                {
                    "src": attrs.get("src", ""),
                    "title": norm_ws(attrs.get("title", "")),
                    "form_name": norm_ws(attrs.get("data-form-name", "")),
                    "form_id": attrs.get("data-form-id", ""),
                }
            )
        elif tag == "form":
            self.forms.append({"action": attrs.get("action", ""), "method": attrs.get("method", "")})

    def handle_endtag(self, tag: str) -> None:
        if tag in self.skip_tags and self._skip_depth:
            self._skip_depth -= 1
        for idx in range(len(self._capture) - 1, -1, -1):
            ctag, chunks, attrs = self._capture[idx]
            if ctag != tag:
                continue
            text = norm_ws("".join(chunks))
            self._capture.pop(idx)
            if text:
                if tag == "title":
                    self.title = text
                elif tag in self.heading_tags:
                    self.headings.append({"level": tag, "text": text})
                    self.text_blocks.append(text)
                elif tag in self.block_tags:
                    self.text_blocks.append(text)
                elif tag == "a":
                    href = attrs.get("href", "")
                    if href:
                        self.links.append({"href": href, "text": text})
            break
        if self._tag_stack:
            self._tag_stack.pop()

    def handle_data(self, data: str) -> None:
        if self._skip_depth:
            return
        if not self._capture:
            return
        for _, chunks, _ in self._capture:
            chunks.append(data)


def parse_html(html: str, page_url: str) -> dict[str, Any]:
    parser = TextExtractor()
    parser.feed(html or "")

    def abs_url(value: str) -> str:
        return urljoin(page_url, value)

    wp_uploads = sorted(set(re.findall(r"https?:\\/\\/evolveup-consulting\.com\\/wp-content\\/uploads\\/[^\"' <>)]+", html)))
    wp_uploads = [u.replace("\\/", "/") for u in wp_uploads]
    images = parser.images + [{"src": u, "alt": "", "title": ""} for u in wp_uploads]
    seen_images: set[str] = set()
    clean_images = []
    for img in images:
        src = abs_url(img.get("src", ""))
        if not src or src in seen_images:
            continue
        seen_images.add(src)
        clean_images.append({"src": src, "alt": img.get("alt", ""), "title": img.get("title", "")})

    links = []
    seen_links: set[tuple[str, str]] = set()
    for link in parser.links:
        href = abs_url(link["href"])
        item = (href, link["text"])
        if item not in seen_links:
            links.append({"href": href, "text": link["text"]})
            seen_links.add(item)

    text = "\n".join(dict.fromkeys(parser.text_blocks))
    return {
        "title": parser.title,
        "meta": parser.meta,
        "headings": parser.headings,
        "text": text,
        "word_count": len(re.findall(r"\w+", text, flags=re.UNICODE)),
        "links": links,
        "images": clean_images,
        "iframes": parser.iframes,
        "forms": parser.forms,
    }


def parse_sitemap(xml: str) -> tuple[list[str], list[dict[str, Any]]]:
    sitemaps = [unescape(item) for item in re.findall(r"<sitemap>\s*<loc>(.*?)</loc>", xml, flags=re.S)]
    urls = []
    for block in re.findall(r"<url>(.*?)</url>", xml, flags=re.S):
        loc_match = re.search(r"<loc>(.*?)</loc>", block, flags=re.S)
        loc = unescape(loc_match.group(1).strip()) if loc_match else ""
        if not loc:
            continue
        lastmod_match = re.search(r"<lastmod>(.*?)</lastmod>", block, flags=re.S)
        urls.append(
            {
                "loc": loc,
                "lastmod": unescape(lastmod_match.group(1).strip()) if lastmod_match else "",
                "images": [unescape(img.strip()) for img in re.findall(r"<image:loc>(.*?)</image:loc>", block, flags=re.S)],
            }
        )
    return sitemaps, urls


def public_page_url(url: str) -> bool:
    parsed = urlparse(url)
    if parsed.scheme and parsed.scheme not in {"http", "https"}:
        return False
    if parsed.netloc and parsed.netloc.lower() != "evolveup-consulting.com":
        return False
    path = parsed.path or "/"
    blocked = (
        "/wp-content/",
        "/wp-json/",
        "/wp-admin/",
        "/wp-includes/",
        "/feed/",
        "/comments/",
    )
    if any(part in path for part in blocked):
        return False
    if re.search(r"\.(png|jpe?g|webp|gif|svg|css|js|xml|pdf|zip)$", path, re.I):
        return False
    return True


def classify(url: str, rest_type: str | None, slug: str | None) -> str:
    path = urlparse(url).path.strip("/")
    if path.startswith("en/"):
        path = path[3:]
    service_slugs = {
        "usluge-evolve-up-consulting",
        "email-marketing",
        "google-i-meta-ads",
        "izrada-marketing-strategije",
        "meta-profit-sistem",
        "seo-optimizacija",
        "web-development",
        "razvoj-drusvenih-mreza",
    }
    if path in service_slugs or slug in service_slugs:
        return "service"
    if rest_type == "post":
        return "blog_post"
    if re.match(r"^20\d\d/\d\d/\d\d$", path):
        return "date_archive"
    if "/category/" in f"/{path}/":
        return "category"
    if "/author/" in f"/{path}/":
        return "author"
    if path == "blog":
        return "blog_index"
    if path == "":
        return "home"
    if urlparse(url).path.strip("/").startswith("en/"):
        return f"en_{rest_type or 'page'}"
    return rest_type or "page"


def compact_rest(item: dict[str, Any], kind: str) -> dict[str, Any]:
    content_html = item.get("content", {}).get("rendered", "")
    parsed = parse_html(content_html, item.get("link", BASE))
    yoast = item.get("yoast_head_json") or {}
    return {
        "id": item.get("id"),
        "kind": kind,
        "slug": item.get("slug"),
        "link": item.get("link"),
        "title": norm_ws(item.get("title", {}).get("rendered", "")),
        "date": item.get("date"),
        "modified": item.get("modified"),
        "status": item.get("status"),
        "template": item.get("template"),
        "seo_title": yoast.get("title"),
        "seo_description": yoast.get("description"),
        "canonical": yoast.get("canonical"),
        "categories": item.get("categories", []),
        "excerpt_text": strip_tags(item.get("excerpt", {}).get("rendered", "")),
        "content_text": parsed["text"],
        "content_word_count": parsed["word_count"],
        "headings": parsed["headings"],
        "links": parsed["links"],
        "images": parsed["images"],
        "iframes": parsed["iframes"],
    }


def main() -> None:
    OUT.mkdir(exist_ok=True)
    WORK.mkdir(exist_ok=True)

    robots_status, robots, _ = fetch(f"{BASE}/robots.txt")
    index_status, sitemap_index, _ = fetch(f"{BASE}/sitemap_index.xml", "application/xml,text/xml,*/*;q=0.8")
    sitemap_urls, sitemap_entries = parse_sitemap(sitemap_index)

    all_sitemap_entries: dict[str, dict[str, Any]] = {}
    for sitemap_url in sitemap_urls:
        status, xml, _ = fetch(sitemap_url, "application/xml,text/xml,*/*;q=0.8")
        _, entries = parse_sitemap(xml)
        for entry in entries:
            all_sitemap_entries[normalize_url(entry["loc"])] = {**entry, "sitemap": sitemap_url, "status": status}
        time.sleep(0.15)

    pages = wp_all("pages")
    posts = wp_all("posts")
    categories = wp_all("categories")
    users = wp_all("users")

    rest_by_url: dict[str, dict[str, Any]] = {}
    for kind, collection in (("page", pages), ("post", posts)):
        for item in collection:
            compact = compact_rest(item, kind)
            rest_by_url[normalize_url(compact["link"])] = compact

    category_records = []
    for cat in categories:
        yoast = cat.get("yoast_head_json") or {}
        record = {
            "id": cat.get("id"),
            "name": norm_ws(cat.get("name", "")),
            "slug": cat.get("slug"),
            "count": cat.get("count"),
            "link": cat.get("link"),
            "description": norm_ws(cat.get("description", "")),
            "seo_title": yoast.get("title"),
            "seo_description": yoast.get("description"),
        }
        category_records.append(record)

    url_pool: dict[str, dict[str, Any]] = dict(all_sitemap_entries)
    for key, item in rest_by_url.items():
        url_pool.setdefault(key, {"loc": item["link"], "lastmod": item.get("modified"), "images": []})
    for cat in category_records:
        if cat["link"]:
            url_pool.setdefault(normalize_url(cat["link"]), {"loc": cat["link"], "lastmod": "", "images": []})

    page_records = []
    discovered: set[str] = set()
    fetched_keys: set[str] = set()

    def fetch_page_record(source: dict[str, Any]) -> dict[str, Any]:
        url = source["loc"]
        status, html, headers = fetch(url)
        parsed = parse_html(html, url)
        rest = rest_by_url.get(normalize_url(url), {})
        return {
            "url": normalize_url(url),
            "fetched_url": url,
            "http_status": status,
            "content_type": headers.get("Content-Type", ""),
            "classification": classify(url, rest.get("kind"), rest.get("slug")),
            "lastmod": source.get("lastmod") or rest.get("modified"),
            "sitemap": source.get("sitemap", ""),
            "sitemap_images": source.get("images", []),
            "rest": rest or None,
            "html": parsed,
        }

    def collect_internal_links(record: dict[str, Any]) -> None:
        for link in record["html"]["links"]:
            href = normalize_url(link["href"])
            if public_page_url(href) and href not in url_pool:
                discovered.add(href)

    for idx, (key, source) in enumerate(sorted(url_pool.items()), start=1):
        record = fetch_page_record(source)
        page_records.append(record)
        fetched_keys.add(record["url"])
        collect_internal_links(record)
        if idx % 10 == 0:
            print(f"fetched {idx}/{len(url_pool)} pages")
        time.sleep(0.2)

    extra_urls = sorted(url for url in discovered if url not in fetched_keys and public_page_url(url))
    extra_total = 0
    max_extra = 250
    while extra_urls and extra_total < max_extra:
        url = extra_urls.pop(0)
        if url in fetched_keys:
            continue
        record = fetch_page_record(
            {"loc": url, "lastmod": "", "images": [], "sitemap": "discovered-internal-link"}
        )
        page_records.append(record)
        fetched_keys.add(record["url"])
        collect_internal_links(record)
        extra_total += 1
        extra_urls = sorted(
            url for url in discovered if url not in fetched_keys and url not in extra_urls and public_page_url(url)
        ) + extra_urls
        if extra_total % 10 == 0:
            print(f"fetched discovered {extra_total} pages")
        time.sleep(0.2)

    discovered = {url for url in discovered if url not in fetched_keys and public_page_url(url)}

    contact_text = "\n".join(
        [page["html"]["text"] for page in page_records]
        + [rest.get("content_text", "") for rest in rest_by_url.values()]
        + [json.dumps(page["html"]["links"], ensure_ascii=False) for page in page_records]
    )
    emails = sorted(set(re.findall(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}", contact_text, flags=re.I)))
    phones = sorted({m.group(1) for m in re.finditer(r"((?:\+|00)387[\d\s()./-]{6,}\d|wa\.me/\d{8,15})", contact_text)})
    external_links = []
    for page in page_records:
        for link in page["html"]["links"]:
            parsed = urlparse(link["href"])
            if parsed.netloc and parsed.netloc.lower() != "evolveup-consulting.com":
                external_links.append({"page": page["url"], **link})

    site_data = {
        "scraped_at": datetime.now(timezone.utc).isoformat(),
        "base_url": BASE,
        "robots": {"status": robots_status, "text": robots},
        "sitemaps": sitemap_urls,
        "counts": {
            "sitemap_pages": len(all_sitemap_entries),
            "wp_pages": len(pages),
            "wp_posts": len(posts),
            "wp_categories": len(categories),
            "wp_users": len(users),
            "fetched_pages": len(page_records),
            "discovered_unfetched_internal_urls": len(discovered),
        },
        "categories": category_records,
        "users": [{"id": u.get("id"), "name": u.get("name"), "slug": u.get("slug"), "link": u.get("link")} for u in users],
        "contact": {"emails": emails, "phones": phones},
        "external_links": external_links,
        "discovered_unfetched_internal_urls": sorted(discovered),
        "pages": page_records,
    }

    (OUT / "evolveup_site_scrape.json").write_text(json.dumps(site_data, ensure_ascii=False, indent=2), encoding="utf-8")
    write_markdown(site_data, OUT / "evolveup_site_inventory.md")
    write_assets_csv(site_data, OUT / "evolveup_assets.csv")
    print(json.dumps(site_data["counts"], ensure_ascii=False, indent=2))


def first_paragraph(text: str) -> str:
    for block in text.splitlines():
        block = norm_ws(block)
        if len(block) > 40:
            return block
    return norm_ws(text[:240])


def page_title(page: dict[str, Any]) -> str:
    rest = page.get("rest") or {}
    return rest.get("title") or page["html"].get("meta", {}).get("og:title") or page["html"].get("title") or page["url"]


def best_text(page: dict[str, Any]) -> str:
    rest = page.get("rest") or {}
    rest_text = norm_ws(rest.get("content_text", ""))
    html_text = norm_ws(page["html"].get("text", ""))
    if len(rest_text) > 80 and rest_text.lower() != "whatsapp":
        return rest.get("content_text", "")
    return page["html"].get("text", "")


def write_markdown(data: dict[str, Any], path: Path) -> None:
    pages = data["pages"]
    service_pages = [p for p in pages if p["classification"] == "service"]
    blog_pages = [p for p in pages if p["classification"] == "blog_post"]
    main_pages = [p for p in pages if p["classification"] not in {"service", "blog_post", "category", "author"}]

    lines = [
        "# Evolve Up Consulting - site scrape inventory",
        "",
        f"Scraped at: `{data['scraped_at']}`",
        f"Base URL: {data['base_url']}",
        "",
        "## Crawl summary",
        "",
        f"- Sitemap pages: {data['counts']['sitemap_pages']}",
        f"- WordPress pages: {data['counts']['wp_pages']}",
        f"- WordPress blog posts: {data['counts']['wp_posts']}",
        f"- WordPress categories: {data['counts']['wp_categories']}",
        f"- Fetched public URLs: {data['counts']['fetched_pages']}",
        f"- Discovered extra internal URLs not fetched: {data['counts']['discovered_unfetched_internal_urls']}",
        "",
        "## Contact and embeds",
        "",
        f"- Phones found: {', '.join(data['contact']['phones']) or 'none'}",
        f"- Emails found: {', '.join(data['contact']['emails']) or 'none'}",
        "",
    ]

    iframe_rows = []
    for page in pages:
        for iframe in page["html"].get("iframes", []):
            iframe_rows.append((page["url"], iframe))
    if iframe_rows:
        lines.append("### Iframes/forms")
        lines.append("")
        for page_url, iframe in iframe_rows:
            lines.append(f"- {page_url}: {iframe.get('title') or iframe.get('form_name') or 'iframe'} -> {iframe.get('src')}")
        lines.append("")

    lines.extend(["## Categories", ""])
    for cat in sorted(data["categories"], key=lambda c: (-(c.get("count") or 0), c.get("name") or "")):
        lines.append(f"### {cat['name']} ({cat['count']} posts)")
        lines.append(f"- URL: {cat.get('link')}")
        if cat.get("description"):
            lines.append(f"- Description: {cat['description']}")
        if cat.get("seo_title"):
            lines.append(f"- SEO title: {cat['seo_title']}")
        if cat.get("seo_description"):
            lines.append(f"- SEO description: {cat['seo_description']}")
        lines.append("")

    lines.extend(["## Services", ""])
    for page in sorted(service_pages, key=lambda p: p["url"]):
        write_page_brief(lines, page)

    lines.extend(["## Main pages", ""])
    for page in sorted(main_pages, key=lambda p: p["url"]):
        write_page_brief(lines, page)

    lines.extend(["## Blog posts by category", ""])
    category_by_id = {cat["id"]: cat["name"] for cat in data["categories"]}
    for page in sorted(blog_pages, key=lambda p: (p.get("rest") or {}).get("date") or "", reverse=True):
        rest = page.get("rest") or {}
        cats = ", ".join(category_by_id.get(cid, str(cid)) for cid in rest.get("categories", []))
        lines.append(f"### {page_title(page)}")
        lines.append(f"- URL: {page['url']}")
        lines.append(f"- Category: {cats or 'n/a'}")
        if rest.get("date"):
            lines.append(f"- Published: {rest['date']}")
        if rest.get("seo_description"):
            lines.append(f"- SEO description: {rest['seo_description']}")
        headings = [h["text"] for h in (rest.get("headings") or page["html"].get("headings", []))]
        if headings:
            lines.append(f"- Headings: {' | '.join(headings[:12])}")
        lines.append(f"- Opening copy: {first_paragraph(best_text(page))}")
        lines.append("")

    lines.extend(["## Full extracted page copy", ""])
    for page in sorted(pages, key=lambda p: (p["classification"], p["url"])):
        write_full_page(lines, page)

    path.write_text("\n".join(lines), encoding="utf-8")


def write_page_brief(lines: list[str], page: dict[str, Any]) -> None:
    rest = page.get("rest") or {}
    meta = page["html"].get("meta", {})
    lines.append(f"### {page_title(page)}")
    lines.append(f"- URL: {page['url']}")
    lines.append(f"- Type: {page['classification']}")
    lines.append(f"- HTTP: {page['http_status']}")
    if page.get("lastmod"):
        lines.append(f"- Last modified: {page['lastmod']}")
    desc = rest.get("seo_description") or meta.get("description") or meta.get("og:description")
    if desc:
        lines.append(f"- SEO description: {desc}")
    headings = [h["text"] for h in (rest.get("headings") or page["html"].get("headings", []))]
    if headings:
        lines.append(f"- Headings: {' | '.join(headings[:14])}")
    text = best_text(page)
    if text:
        lines.append(f"- Opening copy: {first_paragraph(text)}")
    if page["html"].get("iframes"):
        names = [i.get("form_name") or i.get("title") or i.get("src") for i in page["html"]["iframes"]]
        lines.append(f"- Embeds/forms: {', '.join(names)}")
    lines.append("")


def write_full_page(lines: list[str], page: dict[str, Any]) -> None:
    rest = page.get("rest") or {}
    text = best_text(page)
    lines.append(f"### {page_title(page)}")
    lines.append("")
    lines.append(f"- URL: {page['url']}")
    lines.append(f"- Type: {page['classification']}")
    if rest.get("seo_title"):
        lines.append(f"- SEO title: {rest['seo_title']}")
    if rest.get("seo_description"):
        lines.append(f"- SEO description: {rest['seo_description']}")
    if page["html"].get("images"):
        lines.append(f"- Images: {len(page['html']['images'])}")
    lines.append("")
    lines.append("```text")
    lines.append((text or "[no extracted text]").strip())
    lines.append("```")
    lines.append("")


def write_assets_csv(data: dict[str, Any], path: Path) -> None:
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=["page", "kind", "url", "label"])
        writer.writeheader()
        for page in data["pages"]:
            for image in page["html"].get("images", []):
                writer.writerow({"page": page["url"], "kind": "image", "url": image.get("src", ""), "label": image.get("alt", "")})
            for iframe in page["html"].get("iframes", []):
                writer.writerow({"page": page["url"], "kind": "iframe", "url": iframe.get("src", ""), "label": iframe.get("form_name") or iframe.get("title", "")})
            for link in page["html"].get("links", []):
                parsed = urlparse(link["href"])
                if parsed.netloc and parsed.netloc.lower() != "evolveup-consulting.com":
                    writer.writerow({"page": page["url"], "kind": "external_link", "url": link["href"], "label": link.get("text", "")})


if __name__ == "__main__":
    main()
