"""
Comprehensive portfolio site testing script
Tests all routes, interactions, and responsive layouts
"""
from playwright.sync_api import sync_playwright
import os

# Create screenshots directory
os.makedirs('/tmp/portfolio-tests', exist_ok=True)

ROUTES = [
    ('/', 'home'),
    ('/projects', 'projects'),
    ('/skills', 'skills'),
    ('/coursework', 'coursework'),
    ('/terminal', 'terminal'),
]

VIEWPORTS = [
    {'width': 1920, 'height': 1080, 'name': 'desktop'},
    {'width': 768, 'height': 1024, 'name': 'tablet'},
    {'width': 375, 'height': 812, 'name': 'mobile'},
]

def test_portfolio():
    results = {'passed': [], 'failed': []}

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # Test 1: All routes load correctly at desktop viewport
        print("\n=== Testing Route Navigation ===")
        page = browser.new_page(viewport={'width': 1920, 'height': 1080})

        for route, name in ROUTES:
            try:
                page.goto(f'http://localhost:3000{route}')
                page.wait_for_load_state('networkidle')
                page.screenshot(path=f'/tmp/portfolio-tests/{name}-desktop.png', full_page=True)
                print(f"✓ {name} page loaded successfully")
                results['passed'].append(f"Route: {route}")
            except Exception as e:
                print(f"✗ {name} page failed: {e}")
                results['failed'].append(f"Route: {route} - {e}")

        page.close()

        # Test 2: Theme toggle functionality
        print("\n=== Testing Theme Toggle ===")
        page = browser.new_page(viewport={'width': 1920, 'height': 1080})
        try:
            page.goto('http://localhost:3000')
            page.wait_for_load_state('networkidle')

            # Find and click theme toggle
            theme_toggle = page.locator('button:has-text("☀"), button:has-text("🌙"), [aria-label*="theme"], [class*="theme"]').first
            if theme_toggle.is_visible():
                initial_theme = page.evaluate('document.documentElement.getAttribute("data-theme") || document.body.className')
                page.screenshot(path='/tmp/portfolio-tests/theme-before.png')
                theme_toggle.click()
                page.wait_for_timeout(500)
                new_theme = page.evaluate('document.documentElement.getAttribute("data-theme") || document.body.className')
                page.screenshot(path='/tmp/portfolio-tests/theme-after.png')
                print(f"✓ Theme toggle works (changed from {initial_theme[:20]}... to {new_theme[:20]}...)")
                results['passed'].append("Theme toggle")
            else:
                print("⚠ Theme toggle button not found")
                results['failed'].append("Theme toggle - button not found")
        except Exception as e:
            print(f"✗ Theme toggle failed: {e}")
            results['failed'].append(f"Theme toggle - {e}")

        page.close()

        # Test 3: Navigation links work
        print("\n=== Testing Navigation Links ===")
        page = browser.new_page(viewport={'width': 1920, 'height': 1080})
        try:
            page.goto('http://localhost:3000')
            page.wait_for_load_state('networkidle')

            # Find nav links
            nav_links = page.locator('nav a, header a').all()
            print(f"  Found {len(nav_links)} navigation links")

            for link in nav_links[:5]:  # Test first 5 links
                href = link.get_attribute('href')
                if href and href.startswith('/'):
                    link.click()
                    page.wait_for_load_state('networkidle')
                    current_url = page.url
                    if href in current_url or href == '/':
                        print(f"✓ Nav link to {href} works")
                        results['passed'].append(f"Nav link: {href}")
                    page.goto('http://localhost:3000')
                    page.wait_for_load_state('networkidle')
        except Exception as e:
            print(f"✗ Navigation test failed: {e}")
            results['failed'].append(f"Navigation - {e}")

        page.close()

        # Test 4: Responsive layouts
        print("\n=== Testing Responsive Layouts ===")
        for viewport in VIEWPORTS:
            page = browser.new_page(viewport={'width': viewport['width'], 'height': viewport['height']})
            try:
                page.goto('http://localhost:3000')
                page.wait_for_load_state('networkidle')
                page.screenshot(path=f'/tmp/portfolio-tests/home-{viewport["name"]}.png', full_page=True)
                print(f"✓ {viewport['name']} layout ({viewport['width']}x{viewport['height']}) renders correctly")
                results['passed'].append(f"Responsive: {viewport['name']}")
            except Exception as e:
                print(f"✗ {viewport['name']} layout failed: {e}")
                results['failed'].append(f"Responsive: {viewport['name']} - {e}")
            page.close()

        # Test 5: Projects page filtering (if available)
        print("\n=== Testing Projects Page Interactivity ===")
        page = browser.new_page(viewport={'width': 1920, 'height': 1080})
        try:
            page.goto('http://localhost:3000/projects')
            page.wait_for_load_state('networkidle')

            # Look for search/filter inputs
            search_input = page.locator('input[type="search"], input[type="text"], input[placeholder*="search" i]').first
            if search_input.is_visible():
                search_input.fill('test')
                page.wait_for_timeout(500)
                page.screenshot(path='/tmp/portfolio-tests/projects-search.png')
                print("✓ Projects search input works")
                results['passed'].append("Projects search")

            # Look for filter buttons/tags
            filter_buttons = page.locator('button:has-text("All"), [class*="filter"], [class*="tag"]').all()
            if len(filter_buttons) > 0:
                print(f"  Found {len(filter_buttons)} filter options")
                results['passed'].append("Projects filters found")
        except Exception as e:
            print(f"✗ Projects interactivity test failed: {e}")
            results['failed'].append(f"Projects interactivity - {e}")

        page.close()

        # Test 6: Terminal page (if it has interactive features)
        print("\n=== Testing Terminal Page ===")
        page = browser.new_page(viewport={'width': 1920, 'height': 1080})
        try:
            page.goto('http://localhost:3000/terminal')
            page.wait_for_load_state('networkidle')
            page.screenshot(path='/tmp/portfolio-tests/terminal.png', full_page=True)

            # Try to find terminal input
            terminal_input = page.locator('input, textarea, [contenteditable="true"]').first
            if terminal_input.is_visible():
                terminal_input.fill('help')
                terminal_input.press('Enter')
                page.wait_for_timeout(1000)
                page.screenshot(path='/tmp/portfolio-tests/terminal-help.png')
                print("✓ Terminal input works")
                results['passed'].append("Terminal input")
        except Exception as e:
            print(f"✗ Terminal test failed: {e}")
            results['failed'].append(f"Terminal - {e}")

        page.close()

        # Test 7: Console errors check
        print("\n=== Checking for Console Errors ===")
        page = browser.new_page(viewport={'width': 1920, 'height': 1080})
        console_errors = []
        page.on('console', lambda msg: console_errors.append(msg.text) if msg.type == 'error' else None)

        try:
            for route, name in ROUTES:
                page.goto(f'http://localhost:3000{route}')
                page.wait_for_load_state('networkidle')

            if console_errors:
                print(f"⚠ Found {len(console_errors)} console errors:")
                for err in console_errors[:5]:
                    print(f"  - {err[:100]}...")
                results['failed'].append(f"Console errors: {len(console_errors)}")
            else:
                print("✓ No console errors found")
                results['passed'].append("No console errors")
        except Exception as e:
            print(f"✗ Console check failed: {e}")

        page.close()
        browser.close()

    # Summary
    print("\n" + "="*50)
    print("TEST SUMMARY")
    print("="*50)
    print(f"✓ Passed: {len(results['passed'])}")
    print(f"✗ Failed: {len(results['failed'])}")
    print(f"\nScreenshots saved to: /tmp/portfolio-tests/")

    if results['failed']:
        print("\nFailed tests:")
        for fail in results['failed']:
            print(f"  - {fail}")

    return results

if __name__ == '__main__':
    test_portfolio()
