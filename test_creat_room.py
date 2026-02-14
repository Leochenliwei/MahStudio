from playwright.sync_api import sync_playwright
import time

# 测试creat room页面的功能和UI
def test_creat_room_page():
    with sync_playwright() as p:
        # 启动浏览器
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        
        # 导航到creat room页面（使用正确的路由路径）
        page.goto('http://localhost:5173/workbench/1/room-creator')
        
        # 等待页面加载完成
        page.wait_for_load_state('networkidle')
        
        # 截图初始页面
        page.screenshot(path='test_results/initial_page.png', full_page=True)
        print("已截图初始页面")
        
        # 测试添加分组
        try:
            # 查找添加分组按钮，使用CSS选择器
            add_group_btn = page.locator('button')
            # 遍历所有按钮，找到包含"添加分组"文本的
            buttons = add_group_btn.all()
            for btn in buttons:
                text = btn.inner_text()
                if "添加分组" in text:
                    btn.click()
                    time.sleep(1)
                    page.screenshot(path='test_results/after_add_group.png', full_page=True)
                    print("已测试添加分组功能")
                    break
            else:
                print("未找到添加分组按钮")
        except Exception as e:
            print(f"测试添加分组时出错: {e}")
        
        # 测试添加单选元件
        try:
            # 找到所有按钮
            all_buttons = page.locator('button').all()
            for btn in all_buttons:
                text = btn.inner_text()
                if "单选" in text:
                    btn.click()
                    time.sleep(2)
                    # 检查是否打开了配置弹窗（使用更具体的选择器）
                    active_drawer = page.locator('.drawer.active')
                    if active_drawer.is_visible():
                        page.screenshot(path='test_results/option_config_drawer.png', full_page=True)
                        print("已测试添加单选元件并打开配置弹窗")
                        
                        # 测试添加选项功能
                        try:
                            # 查找添加选项按钮
                            option_buttons = page.locator('button').all()
                            for opt_btn in option_buttons:
                                opt_text = opt_btn.inner_text()
                                if "添加选项" in opt_text:
                                    opt_btn.click()
                                    time.sleep(1)
                                    page.screenshot(path='test_results/after_add_option.png', full_page=True)
                                    print("已测试添加选项功能")
                                    break
                            else:
                                print("未找到添加选项按钮")
                        except Exception as e:
                            print(f"测试添加选项时出错: {e}")
                    else:
                        print("添加单选元件后未打开配置弹窗")
                    break
            else:
                print("未找到添加单选按钮")
        except Exception as e:
            print(f"测试添加单选元件时出错: {e}")
        
        # 测试保存功能
        try:
            # 查找所有按钮，使用更简单的方法
            all_buttons = page.locator('button').all()
            for btn in all_buttons:
                try:
                    text = btn.inner_text()
                    if "保存" in text:
                        # 直接点击按钮
                        btn.click()
                        time.sleep(2)
                        page.screenshot(path='test_results/after_save.png', full_page=True)
                        print("已测试保存功能")
                        break
                except Exception as btn_error:
                    print(f"点击按钮时出错: {btn_error}")
                    continue
            else:
                print("未找到保存按钮")
        except Exception as e:
            print(f"测试保存功能时出错: {e}")
        
        # 检查页面元素和样式
        try:
            # 检查基础参数行
            rule_rows = page.locator('.rule-row')
            print(f"找到 {rule_rows.count()} 个基础参数行")
            
            # 检查分组
            groups = page.locator('.group-box')
            print(f"找到 {groups.count()} 个分组")
            
            # 检查动态组件
            dynamic_comps = page.locator('.dynamic-comp')
            print(f"找到 {dynamic_comps.count()} 个动态组件")
            
        except Exception as e:
            print(f"检查页面元素时出错: {e}")
        
        # 关闭浏览器
        browser.close()
        print("测试完成")

if __name__ == "__main__":
    # 创建测试结果目录
    import os
    if not os.path.exists('test_results'):
        os.makedirs('test_results')
    
    test_creat_room_page()
