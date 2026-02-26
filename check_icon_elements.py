from playwright.sync_api import sync_playwright

# 检查页面中图标元素的脚本
def check_icon_elements():
    with sync_playwright() as p:
        # 启动浏览器
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # 访问GameDirectory页面
        print("Accessing GameDirectory page...")
        page.goto('http://localhost:5173/MahStudio/')
        page.wait_for_load_state('networkidle')
        
        # 等待一段时间，让页面完全加载
        page.wait_for_timeout(2000)
        
        # 检查编辑按钮的图标
        print("\nChecking edit button icon...")
        try:
            edit_button = page.locator('.action-btn:has-text("编辑")').first
            edit_icon = edit_button.locator('svg').first
            print(f"Edit button icon found: {edit_icon.is_visible()}")
            if edit_icon.is_visible():
                edit_icon_html = edit_icon.inner_html()
                print(f"Edit icon inner HTML: {edit_icon_html}")
        except Exception as e:
            print(f"Error checking edit button: {e}")
        
        # 检查复制按钮的图标
        print("\nChecking copy button icon...")
        try:
            copy_button = page.locator('.action-btn:has-text("复制")').first
            copy_icon = copy_button.locator('svg').first
            print(f"Copy button icon found: {copy_icon.is_visible()}")
            if copy_icon.is_visible():
                copy_icon_html = copy_icon.inner_html()
                print(f"Copy icon inner HTML: {copy_icon_html}")
        except Exception as e:
            print(f"Error checking copy button: {e}")
        
        # 检查复制到按钮的图标
        print("\nChecking copy-to button icon...")
        try:
            copy_to_button = page.locator('.action-btn:has-text("复制到")').first
            copy_to_icon = copy_to_button.locator('svg').first
            print(f"Copy-to button icon found: {copy_to_icon.is_visible()}")
            if copy_to_icon.is_visible():
                copy_to_icon_html = copy_to_icon.inner_html()
                print(f"Copy-to icon inner HTML: {copy_to_icon_html}")
        except Exception as e:
            print(f"Error checking copy-to button: {e}")
        
        # 检查提测按钮的图标
        print("\nChecking submit test button icon...")
        try:
            submit_test_button = page.locator('.action-btn:has-text("提测")').first
            submit_test_icon = submit_test_button.locator('svg').first
            print(f"Submit test button icon found: {submit_test_icon.is_visible()}")
            if submit_test_icon.is_visible():
                submit_test_icon_html = submit_test_icon.inner_html()
                print(f"Submit test icon inner HTML: {submit_test_icon_html}")
        except Exception as e:
            print(f"Error checking submit test button: {e}")
        
        # 截图保存
        page.screenshot(path='game_directory_icons.png')
        print("\nScreenshot saved to game_directory_icons.png")
        
        # 检查网络请求
        print("\nChecking network requests...")
        network_requests = page.context.cookies()
        print(f"Number of network requests: {len(network_requests)}")
        
        browser.close()

if __name__ == "__main__":
    check_icon_elements()
