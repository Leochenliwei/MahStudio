from playwright.sync_api import sync_playwright

# 检查页面中图标HTML结构的脚本
def check_icon_html():
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
        
        # 检查编辑按钮的HTML
        print("\nChecking edit button HTML...")
        try:
            edit_button = page.locator('.action-btn:has-text("编辑")').first
            edit_button_html = edit_button.inner_html()
            print(f"Edit button HTML: {edit_button_html}")
        except Exception as e:
            print(f"Error checking edit button: {e}")
        
        # 检查复制按钮的HTML
        print("\nChecking copy button HTML...")
        try:
            copy_button = page.locator('.action-btn:has-text("复制")').first
            copy_button_html = copy_button.inner_html()
            print(f"Copy button HTML: {copy_button_html}")
        except Exception as e:
            print(f"Error checking copy button: {e}")
        
        # 检查复制到按钮的HTML
        print("\nChecking copy-to button HTML...")
        try:
            copy_to_button = page.locator('.action-btn:has-text("复制到")').first
            copy_to_button_html = copy_to_button.inner_html()
            print(f"Copy-to button HTML: {copy_to_button_html}")
        except Exception as e:
            print(f"Error checking copy-to button: {e}")
        
        # 检查提测按钮的HTML
        print("\nChecking submit test button HTML...")
        try:
            submit_test_button = page.locator('.action-btn:has-text("提测")').first
            submit_test_button_html = submit_test_button.inner_html()
            print(f"Submit test button HTML: {submit_test_button_html}")
        except Exception as e:
            print(f"Error checking submit test button: {e}")
        
        # 截图保存
        page.screenshot(path='game_directory_html.png')
        print("\nScreenshot saved to game_directory_html.png")
        
        browser.close()

if __name__ == "__main__":
    check_icon_html()
