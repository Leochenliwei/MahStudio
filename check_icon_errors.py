from playwright.sync_api import sync_playwright

# 检查图标加载错误的脚本
def check_icon_errors():
    with sync_playwright() as p:
        # 启动浏览器
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        
        # 监听控制台错误
        errors = []
        def log_error(msg):
            if msg.type == 'error':
                errors.append(msg.text)
                print(f"Error: {msg.text}")
        
        page.on('console', log_error)
        
        # 访问GameDirectory页面
        print("Accessing GameDirectory page...")
        page.goto('http://localhost:5173/MahStudio/')
        page.wait_for_load_state('networkidle')
        
        # 等待一段时间，让可能的错误出现
        page.wait_for_timeout(3000)
        
        # 检查是否有错误
        if errors:
            print("\nFound icon loading errors:")
            for error in errors:
                print(f"- {error}")
        else:
            print("\nNo icon loading errors found")
        
        # 截图保存
        page.screenshot(path='game_directory_screenshot.png')
        print("\nScreenshot saved to game_directory_screenshot.png")
        
        browser.close()

if __name__ == "__main__":
    check_icon_errors()
