from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    # 启动浏览器
    browser = p.chromium.launch(headless=False)  # 使用非无头模式以便查看测试过程
    page = browser.new_page()
    
    # 导航到开发服务器
    page.goto('http://localhost:5174')
    
    # 等待页面加载完成
    page.wait_for_load_state('networkidle')
    
    # 截图：初始页面
    page.screenshot(path='/tmp/initial_page.png', full_page=True)
    print("初始页面截图已保存到 /tmp/initial_page.png")
    
    # 等待工作台加载完成
    time.sleep(2)
    
    # 找到并点击创房选项按钮
    try:
        # 尝试找到底部工具栏中的创房选项按钮
        create_room_button = page.locator('text=创房选项')
        if create_room_button.is_visible():
            create_room_button.click()
            print("点击了创房选项按钮")
        else:
            print("未找到创房选项按钮，尝试其他方式")
            
        # 等待页面跳转
        page.wait_for_load_state('networkidle')
        
        # 截图：创房选项页面
        page.screenshot(path='/tmp/room_creator_page.png', full_page=True)
        print("创房选项页面截图已保存到 /tmp/room_creator_page.png")
        
        # 尝试找到规则按钮并点击
        time.sleep(2)
        rule_buttons = page.locator('.rule-tag').all()
        if rule_buttons:
            rule_buttons[0].click()
            print("点击了规则按钮")
            
            # 等待组件选择抽屉出现
            page.wait_for_load_state('networkidle')
            time.sleep(1)
            
            # 截图：组件选择抽屉
            page.screenshot(path='/tmp/component_selector.png', full_page=True)
            print("组件选择抽屉截图已保存到 /tmp/component_selector.png")
            
            # 测试左右分栏布局
            split_layout = page.locator('.split-layout')
            if split_layout.is_visible():
                print("✅ 左右分栏布局已正常显示")
            else:
                print("❌ 左右分栏布局未显示")
            
            # 测试左侧组件列表
            components_list = page.locator('.components-list-panel')
            if components_list.is_visible():
                print("✅ 左侧组件列表已正常显示")
            else:
                print("❌ 左侧组件列表未显示")
            
            # 测试右侧属性面板
            properties_panel = page.locator('.properties-panel')
            if properties_panel.is_visible():
                print("✅ 右侧属性面板已正常显示")
            else:
                print("❌ 右侧属性面板未显示")
            
            # 尝试选择一个组件
            component_items = page.locator('.component-item').all()
            if component_items:
                component_items[0].click()
                print("✅ 已点击第一个组件")
                time.sleep(1)
                
                # 截图：选择组件后
                page.screenshot(path='/tmp/component_selected.png', full_page=True)
                print("选择组件后截图已保存到 /tmp/component_selected.png")
                
                # 检查右侧属性面板是否显示了组件属性
                property_items = page.locator('.property-item').all()
                if property_items:
                    print(f"✅ 右侧属性面板显示了 {len(property_items)} 个属性")
                else:
                    print("❌ 右侧属性面板未显示属性")
            else:
                print("❌ 未找到组件项")
                
        else:
            print("未找到规则按钮")
            
    except Exception as e:
        print(f"测试过程中出现错误: {e}")
    
    # 关闭浏览器
    browser.close()
    print("测试完成")
