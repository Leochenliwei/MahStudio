from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    # 启动浏览器
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
    
    # 导航到游戏列表页面
    page.goto('http://localhost:5173')
    page.wait_for_load_state('networkidle')
    
    # 等待页面加载完成
    time.sleep(2)
    
    # 截图：初始页面
    page.screenshot(path='test_results/initial_page.png', full_page=True)
    print('已截图：初始页面')
    
    # 点击新增游戏按钮
    add_game_button = page.locator('button:has-text("新增游戏")')
    add_game_button.click()
    print('已点击新增游戏按钮')
    
    # 等待弹窗出现
    page.wait_for_selector('.modal-overlay', state='visible')
    time.sleep(1)
    
    # 截图：弹窗页面
    page.screenshot(path='test_results/add_game_modal.png', full_page=True)
    print('已截图：弹窗页面')
    
    # 输入游戏名称
    game_name_input = page.locator('input#gameName')
    test_game_name = '测试游戏'
    game_name_input.fill(test_game_name)
    print(f'已输入游戏名称：{test_game_name}')
    
    # 点击确认按钮
    confirm_button = page.locator('button:has-text("确认")')
    confirm_button.click()
    print('已点击确认按钮')
    
    # 等待loading动画出现
    page.wait_for_selector('.loading-overlay', state='visible')
    print('已显示loading动画')
    time.sleep(2)  # 等待loading动画显示一段时间
    
    # 等待loading动画消失并页面跳转
    page.wait_for_selector('.loading-overlay', state='hidden')
    page.wait_for_load_state('networkidle')
    time.sleep(2)
    
    # 截图：工作台页面
    page.screenshot(path='test_results/workbench_page.png', full_page=True)
    print('已截图：工作台页面')
    
    # 验证是否成功进入工作台
    current_url = page.url
    print(f'当前URL：{current_url}')
    if '/workbench' in current_url:
        print('✅ 成功进入工作台')
    else:
        print('❌ 未能进入工作台')
    
    # 使用浏览器返回按钮返回游戏列表页面
    page.go_back()
    page.wait_for_load_state('networkidle')
    time.sleep(2)
    
    # 截图：游戏列表页面（包含新游戏）
    page.screenshot(path='test_results/game_list_with_new_game.png', full_page=True)
    print('已截图：游戏列表页面（包含新游戏）')
    
    # 验证新游戏是否出现在列表中
    game_list = page.locator('.config-table-row')
    game_rows = game_list.all()
    print(f'游戏列表行数：{len(game_rows)}')
    
    new_game_found = False
    for row in game_rows:
        cells = row.locator('td').all()
        if len(cells) > 1:
            game_name = cells[1].text_content()
            if game_name == test_game_name:
                new_game_found = True
                print(f'✅ 找到新游戏：{game_name}')
                break
    
    if not new_game_found:
        print('❌ 未找到新游戏')
    
    # 关闭浏览器
    browser.close()
    print('测试完成')
