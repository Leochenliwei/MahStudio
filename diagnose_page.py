#!/usr/bin/env python3
"""
诊断页面状态的脚本
"""

from playwright.sync_api import sync_playwright
import time


def diagnose_page():
    """诊断页面状态"""
    with sync_playwright() as p:
        # 启动浏览器
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        
        try:
            # 导航到应用
            page.goto('http://localhost:5175/MahStudio/')
            print("✅ 导航到应用")
            
            # 等待页面加载
            page.wait_for_load_state('networkidle')
            time.sleep(5)
            
            # 打印当前URL
            print(f"当前URL: {page.url}")
            
            # 打印页面标题
            print(f"页面标题: {page.title()}")
            
            # 截图保存
            page.screenshot(path='page_screenshot.png')
            print("✅ 已保存页面截图")
            
            # 检查页面内容
            content = page.content()
            print(f"页面内容长度: {len(content)}")
            
            # 查找所有按钮
            buttons = page.locator('button').all()
            print(f"找到 {len(buttons)} 个按钮")
            
            if buttons:
                for i, button in enumerate(buttons):
                    text = button.text_content()
                    print(f"按钮 {i}: {text}")
            else:
                print("未找到按钮，检查页面结构...")
                
                # 检查页面主要元素
                body = page.locator('body')
                if body.is_visible():
                    print("✅ body 元素可见")
                
                # 检查管理容器
                admin_container = page.locator('.admin-container')
                if admin_container.is_visible():
                    print("✅ admin-container 元素可见")
                else:
                    print("❌ admin-container 元素不可见")
                
                # 检查游戏列表
                game_table = page.locator('.config-table')
                if game_table.is_visible():
                    print("✅ config-table 元素可见")
                else:
                    print("❌ config-table 元素不可见")
            
            # 检查控制台日志
            console_logs = page.console.logs()
            print(f"控制台日志数量: {len(console_logs)}")
            for log in console_logs:
                print(f"控制台: {log.text}")
            
        except Exception as e:
            print(f"❌ 测试过程中出错: {e}")
        finally:
            # 关闭浏览器
            browser.close()
            print("✅ 测试完成，浏览器已关闭")


if __name__ == '__main__':
    diagnose_page()