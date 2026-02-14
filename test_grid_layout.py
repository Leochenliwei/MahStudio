from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)  # 非无头模式，以便查看效果
    page = browser.new_page()
    
    # 导航到本地开发服务器
    page.goto('http://localhost:5174')
    page.wait_for_load_state('networkidle')  # 等待网络空闲
    
    # 截图整个页面，查看初始状态
    page.screenshot(path='/tmp/initial_screenshot.png', full_page=True)
    print('已保存初始截图: /tmp/initial_screenshot.png')
    
    # 查找并点击一个组件，以显示属性面板
    try:
        # 等待组件列表加载
        page.wait_for_selector('.component-item', timeout=10000)
        
        # 点击第一个组件
        component_items = page.locator('.component-item')
        if component_items.count() > 0:
            component_items.first.click()
            print('已点击第一个组件')
            
            # 等待属性面板加载
            page.wait_for_load_state('networkidle')
            
            # 截图属性面板部分
            if page.locator('.properties-panel').is_visible():
                properties_panel = page.locator('.properties-panel')
                properties_panel.screenshot(path='/tmp/properties_panel.png')
                print('已保存属性面板截图: /tmp/properties_panel.png')
                
                # 检查是否有复选框组
                if page.locator('.checkbox-group').is_visible():
                    print('找到复选框组')
                    checkbox_groups = page.locator('.checkbox-group')
                    print(f'找到 {checkbox_groups.count()} 个复选框组')
                    
                    # 为每个复选框组截图
                    for i in range(checkbox_groups.count()):
                        checkbox_group = checkbox_groups.nth(i)
                        checkbox_group.screenshot(path=f'/tmp/checkbox_group_{i}.png')
                        print(f'已保存复选框组 {i} 截图: /tmp/checkbox_group_{i}.png')
                
                # 检查是否有单选按钮组
                if page.locator('.toggle-group').is_visible():
                    print('找到单选按钮组')
                    toggle_groups = page.locator('.toggle-group')
                    print(f'找到 {toggle_groups.count()} 个单选按钮组')
                    
                    # 为每个单选按钮组截图
                    for i in range(toggle_groups.count()):
                        toggle_group = toggle_groups.nth(i)
                        toggle_group.screenshot(path=f'/tmp/toggle_group_{i}.png')
                        print(f'已保存单选按钮组 {i} 截图: /tmp/toggle_group_{i}.png')
    except Exception as e:
        print(f'测试过程中出错: {e}')
    
    # 关闭浏览器
    browser.close()
    print('测试完成')
