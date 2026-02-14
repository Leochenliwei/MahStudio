from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    # 启动浏览器
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
    
    # 导航到房间创建页面
    page.goto('http://localhost:5174/room-creator/1')
    page.wait_for_load_state('networkidle')
    
    # 截图初始页面
    page.screenshot(path='test_screenshots/initial_page.png', full_page=True)
    print('初始页面已截图')
    
    # 点击添加分组
    page.click('text=添加分组')
    page.wait_for_timeout(1000)
    print('已添加分组')
    
    # 点击添加单选组件
    page.click('text=单选')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(1000)
    print('已点击添加单选组件')
    
    # 截图配置弹窗
    page.screenshot(path='test_screenshots/config_popup.png', full_page=True)
    print('配置弹窗已截图')
    
    # 测试添加选项
    page.click('text=添加选项')
    page.wait_for_timeout(500)
    print('已添加新选项')
    
    # 测试删除选项
    delete_buttons = page.locator('.delete-tag').all()
    if delete_buttons:
        delete_buttons[0].click()
        page.wait_for_timeout(500)
        print('已删除一个选项')
    
    # 测试保存配置
    page.click('text=保存配置')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(1000)
    print('已保存配置')
    
    # 截图最终页面
    page.screenshot(path='test_screenshots/final_page.png', full_page=True)
    print('最终页面已截图')
    
    # 关闭浏览器
    browser.close()
    print('测试完成')
