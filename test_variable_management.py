from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    # 启动浏览器
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
    
    # 导航到工作台页面
    page.goto('http://localhost:5173/workbench/1')
    
    # 等待页面加载完成
    page.wait_for_load_state('networkidle')
    
    # 等待工作台页面元素加载
    page.wait_for_selector('.workbench-container')
    
    # 点击底部工具栏中的变量管理按钮
    page.click('.bottom-toolbar .toolbar-item:nth-child(2)')
    
    # 等待变量管理弹窗出现
    page.wait_for_selector('.modal-overlay')
    
    # 等待弹窗内容加载
    page.wait_for_selector('.variable-table')
    
    # 截图：变量管理弹窗
    page.screenshot(path='/Users/zonst/Documents/Programs/WEBconfig/test_results/variable_management_modal.png', full_page=True)
    
    # 测试搜索功能
    page.fill('.search-input', '牌型')
    page.click('.search-btn')
    page.wait_for_timeout(1000)
    page.screenshot(path='/Users/zonst/Documents/Programs/WEBconfig/test_results/variable_management_search.png', full_page=True)
    
    # 测试新增变量
    page.click('.add-btn')
    page.wait_for_selector('.variable-form')
    page.fill('.form-input', '测试变量')
    page.fill('.form-textarea', '测试变量说明')
    page.click('.submit-btn')
    page.wait_for_timeout(1000)
    page.screenshot(path='/Users/zonst/Documents/Programs/WEBconfig/test_results/variable_management_add.png', full_page=True)
    
    # 测试编辑变量
    page.click('.edit-btn')
    page.wait_for_selector('.variable-form')
    page.fill('.form-input', '测试变量编辑')
    page.click('.submit-btn')
    page.wait_for_timeout(1000)
    page.screenshot(path='/Users/zonst/Documents/Programs/WEBconfig/test_results/variable_management_edit.png', full_page=True)
    
    # 测试查看变量
    page.click('.view-btn')
    page.wait_for_selector('.variable-details')
    page.screenshot(path='/Users/zonst/Documents/Programs/WEBconfig/test_results/variable_management_view.png', full_page=True)
    page.click('.ok-btn')
    
    # 测试禁用变量
    page.click('.disable-btn')
    page.wait_for_timeout(1000)
    page.screenshot(path='/Users/zonst/Documents/Programs/WEBconfig/test_results/variable_management_disable.png', full_page=True)
    
    # 测试删除变量
    page.click('.delete-btn')
    page.wait_for_selector('.delete-confirm')
    page.screenshot(path='/Users/zonst/Documents/Programs/WEBconfig/test_results/variable_management_delete_confirm.png', full_page=True)
    page.click('.dialog-actions .delete-btn')
    page.wait_for_timeout(1000)
    page.screenshot(path='/Users/zonst/Documents/Programs/WEBconfig/test_results/variable_management_delete.png', full_page=True)
    
    # 测试分页功能
    page.click('.page-btn:has-text("2")')
    page.wait_for_timeout(1000)
    page.screenshot(path='/Users/zonst/Documents/Programs/WEBconfig/test_results/variable_management_pagination.png', full_page=True)
    
    # 关闭变量管理弹窗
    page.click('.close-btn')
    
    # 等待弹窗关闭
    page.wait_for_selector('.modal-overlay', state='hidden')
    
    # 关闭浏览器
    browser.close()
    
    print("测试完成，截图已保存到 test_results 目录")
