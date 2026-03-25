from playwright.sync_api import sync_playwright
import time

# 测试计分规则模块布局修复
def test_score_calculation_layout():
    with sync_playwright() as p:
        # 启动浏览器
        browser = p.chromium.launch(headless=False)  # 非无头模式，便于观察
        page = browser.new_page()
        
        # 导航到应用
        page.goto('http://localhost:4174/MahStudio')
        page.wait_for_load_state('networkidle')
        
        # 等待页面加载完成
        time.sleep(2)
        
        # 截取初始页面
        page.screenshot(path='test_results/score_calculation_initial.png', full_page=True)
        
        # 点击工作台或相关按钮进入规则配置
        # 注意：这里需要根据实际页面结构调整选择器
        try:
            # 尝试点击工作台按钮
            workbench_button = page.locator('text=工作台')
            if workbench_button.is_visible():
                workbench_button.click()
                page.wait_for_load_state('networkidle')
                time.sleep(2)
                
                # 截取工作台页面
                page.screenshot(path='test_results/score_calculation_workbench.png', full_page=True)
                
                # 寻找算分规则配置按钮
                calc_score_button = page.locator('text=算分规则')
                if calc_score_button.is_visible():
                    calc_score_button.click()
                    page.wait_for_load_state('networkidle')
                    time.sleep(3)
                    
                    # 截取算分规则配置弹窗
                    page.screenshot(path='test_results/score_calculation_modal.png', full_page=True)
                    
                    # 验证弹窗高度
                    modal = page.locator('.el-dialog')
                    if modal.is_visible():
                        modal_bounding_box = modal.bounding_box()
                        print(f"弹窗高度: {modal_bounding_box['height']}")
                        print(f"弹窗宽度: {modal_bounding_box['width']}")
                        
                        # 验证头部固定
                        header = page.locator('.editor-header')
                        if header.is_visible():
                            header_bounding_box = header.bounding_box()
                            print(f"头部高度: {header_bounding_box['height']}")
                            print(f"头部位置: {header_bounding_box['y']}")
                        
                        # 验证底部固定
                        footer = page.locator('.section-foot')
                        if footer.is_visible():
                            footer_bounding_box = footer.bounding_box()
                            print(f"底部位置: {footer_bounding_box['y']}")
                        
                        # 验证中间滚动区域
                        scenario_list = page.locator('.scenario-list')
                        if scenario_list.is_visible():
                            scenario_list_bounding_box = scenario_list.bounding_box()
                            print(f"滚动区域高度: {scenario_list_bounding_box['height']}")
                            print(f"滚动区域位置: {scenario_list_bounding_box['y']}")
                            
                            # 尝试滚动
                            page.mouse.move(scenario_list_bounding_box['x'] + 100, scenario_list_bounding_box['y'] + 100)
                            page.mouse.wheel(0, 200)  # 向下滚动
                            time.sleep(1)
                            page.screenshot(path='test_results/score_calculation_scrolled.png', full_page=True)
                            
                            # 再次检查头部和底部位置
                            if header.is_visible():
                                new_header_bounding_box = header.bounding_box()
                                print(f"滚动后头部位置: {new_header_bounding_box['y']}")
                            
                            if footer.is_visible():
                                new_footer_bounding_box = footer.bounding_box()
                                print(f"滚动后底部位置: {new_footer_bounding_box['y']}")
        except Exception as e:
            print(f"测试过程中出现错误: {e}")
        finally:
            # 关闭浏览器
            browser.close()

if __name__ == "__main__":
    test_score_calculation_layout()
    print("测试完成，截图已保存到 test_results 目录")
