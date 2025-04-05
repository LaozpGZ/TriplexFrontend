// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    initTabSystem();
    initModals();
    initAssetSelector();
    initRiskSimulator();
});

// 选项卡切换系统
function initTabSystem() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除所有活跃状态
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // 添加活跃状态到当前选项卡
            this.classList.add('active');
            
            // 获取选项卡ID并显示对应内容
            const tabId = this.id;
            const contentId = tabId.replace('tab-', 'tab-content-');
            document.getElementById(contentId).classList.add('active');
        });
    });
}

// 模态窗口系统
function initModals() {
    // 打开追加抵押品模态框
    document.querySelectorAll('.add-collateral-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const asset = this.getAttribute('data-asset');
            const modal = document.getElementById('add-collateral-modal');
            
            // 设置资产名称
            modal.querySelectorAll('.asset-name').forEach(el => el.textContent = asset);
            modal.querySelectorAll('.asset-symbol').forEach(el => el.textContent = asset);
            
            // 设置当前抵押率(演示数据)
            let currentRatio = '187.0%';
            let liquidationThreshold = '140%';
            
            if (asset === 'WBTC') {
                currentRatio = '149.3%';
                liquidationThreshold = '135%';
            } else if (asset === 'stAPT') {
                currentRatio = '189.9%';
                liquidationThreshold = '145%';
            }
            
            modal.querySelectorAll('.current-ratio').forEach(el => el.textContent = currentRatio);
            modal.querySelectorAll('.liquidation-threshold').forEach(el => el.textContent = liquidationThreshold);
            
            // 显示模态框
            modal.style.display = 'flex';
        });
    });
    
    // 打开提取抵押品模态框
    document.querySelectorAll('.withdraw-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const asset = this.getAttribute('data-asset');
            const modal = document.getElementById('withdraw-modal');
            
            // 设置资产名称
            modal.querySelectorAll('.asset-name').forEach(el => el.textContent = asset);
            modal.querySelectorAll('.asset-symbol').forEach(el => el.textContent = asset);
            
            // 设置当前抵押率(演示数据)
            let currentRatio = '187.0%';
            let liquidationThreshold = '140%';
            let newRatio = '168.3%';
            let healthPercent = 75;
            let healthClass = 'caution';
            
            if (asset === 'WBTC') {
                currentRatio = '149.3%';
                liquidationThreshold = '135%';
                newRatio = '138.7%';
                healthPercent = 30;
                healthClass = 'danger';
                
                // 显示警告
                document.getElementById('withdraw-warning').style.display = 'block';
            } else if (asset === 'stAPT') {
                currentRatio = '189.9%';
                liquidationThreshold = '145%';
                newRatio = '176.5%';
                healthPercent = 85;
                healthClass = 'safe';
                
                // 隐藏警告
                document.getElementById('withdraw-warning').style.display = 'none';
            } else {
                // 隐藏警告
                document.getElementById('withdraw-warning').style.display = 'none';
            }
            
            modal.querySelectorAll('.current-ratio').forEach(el => el.textContent = currentRatio);
            modal.querySelectorAll('.liquidation-threshold').forEach(el => el.textContent = liquidationThreshold);
            modal.querySelector('.new-ratio').value = newRatio;
            
            // 更新健康条
            const healthFill = modal.querySelector('.health-fill');
            healthFill.style.width = healthPercent + '%';
            healthFill.className = 'health-fill ' + healthClass;
            
            modal.querySelector('.health-percent').textContent = healthPercent + '%';
            modal.querySelector('.health-percent').className = 'health-percent ' + healthClass;
            
            // 显示模态框
            modal.style.display = 'flex';
        });
    });
    
    // 关闭模态框
    document.querySelectorAll('.close-button').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal-backdrop');
            modal.style.display = 'none';
        });
    });

    // 点击模态框背景关闭
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
        modal.addEventListener('click', function(e) {
            // 只有当点击的是模态框背景而不是内容时才关闭
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });
}

// 资产选择器
function initAssetSelector() {
    document.querySelectorAll('.asset-option').forEach(option => {
        option.addEventListener('click', function() {
            // 移除所有选中状态
            document.querySelectorAll('.asset-option').forEach(o => o.classList.remove('selected'));
            
            // 添加选中状态到当前选项
            this.classList.add('selected');
            
            // 更新表单内容(演示)
            const asset = this.getAttribute('data-asset');
            const balanceValue = document.querySelector('.balance-value');
            
            if (asset === 'APT') {
                balanceValue.textContent = '125.8 APT';
            } else if (asset === 'WBTC') {
                balanceValue.textContent = '0.65 WBTC';
            } else if (asset === 'stAPT') {
                balanceValue.textContent = '78.3 stAPT';
            } else if (asset === 'SOL') {
                balanceValue.textContent = '43.2 SOL';
            } else if (asset === 'ETH') {
                balanceValue.textContent = '1.8 ETH';
            }
        });
    });

    // 最大值按钮
    document.querySelectorAll('.max-button').forEach(button => {
        button.addEventListener('click', function() {
            // 获取对应的输入框和当前选择的资产
            const input = this.closest('.input-wrapper').querySelector('.form-input');
            const balanceText = this.closest('.form-group').querySelector('.balance-value').textContent;
            const balance = parseFloat(balanceText.split(' ')[0]);
            
            // 设置输入值为最大余额
            input.value = balance;
            
            // 触发输入事件以更新计算
            const event = new Event('input', { bubbles: true });
            input.dispatchEvent(event);
        });
    });
}

// 风险模拟器
function initRiskSimulator() {
    document.querySelectorAll('.price-slider').forEach(slider => {
        slider.addEventListener('input', function() {
            const value = this.value;
            const asset = this.getAttribute('data-asset');
            
            // 更新滑块值显示
            this.closest('.slider-container').querySelector('.slider-value').textContent = value + '%';
            
            // 更新模拟结果(简单演示)
            const totalCollateralRatio = document.querySelector('.simulation-results .result-value');
            const resultChange = document.querySelector('.simulation-results .result-change');
            const riskStatus = document.querySelector('.simulation-results .result-status');
            
            if (value < -20) {
                totalCollateralRatio.textContent = '152.3%';
                resultChange.textContent = '(-20.8%)';
                resultChange.className = 'result-change negative';
                
                riskStatus.textContent = '1 个头寸';
                riskStatus.className = 'result-status warning';
            } else if (value < -10) {
                totalCollateralRatio.textContent = '162.7%';
                resultChange.textContent = '(-10.4%)';
                resultChange.className = 'result-change negative';
                
                riskStatus.textContent = '0 个头寸';
                riskStatus.className = 'result-status safe';
            } else if (value < 0) {
                totalCollateralRatio.textContent = '169.5%';
                resultChange.textContent = '(-3.6%)';
                resultChange.className = 'result-change negative';
                
                riskStatus.textContent = '0 个头寸';
                riskStatus.className = 'result-status safe';
            } else if (value == 0) {
                totalCollateralRatio.textContent = '173.1%';
                resultChange.textContent = '(无变化)';
                resultChange.className = 'result-change unchanged';
                
                riskStatus.textContent = '0 个头寸';
                riskStatus.className = 'result-status safe';
            } else if (value > 20) {
                totalCollateralRatio.textContent = '198.6%';
                resultChange.textContent = '(+25.5%)';
                resultChange.className = 'result-change positive';
                
                riskStatus.textContent = '0 个头寸';
                riskStatus.className = 'result-status safe';
            } else if (value > 10) {
                totalCollateralRatio.textContent = '186.2%';
                resultChange.textContent = '(+13.1%)';
                resultChange.className = 'result-change positive';
                
                riskStatus.textContent = '0 个头寸';
                riskStatus.className = 'result-status safe';
            } else if (value > 0) {
                totalCollateralRatio.textContent = '178.4%';
                resultChange.textContent = '(+5.3%)';
                resultChange.className = 'result-change positive';
                
                riskStatus.textContent = '0 个头寸';
                riskStatus.className = 'result-status safe';
            }
        });
    });
    
    // 重置模拟
    document.getElementById('reset-simulation').addEventListener('click', function() {
        document.querySelectorAll('.price-slider').forEach(slider => {
            slider.value = 0;
            slider.closest('.slider-container').querySelector('.slider-value').textContent = '0%';
        });
        
        // 重置结果
        const totalCollateralRatio = document.querySelector('.simulation-results .result-value');
        const resultChange = document.querySelector('.simulation-results .result-change');
        const riskStatus = document.querySelector('.simulation-results .result-status');
        
        totalCollateralRatio.textContent = '173.1%';
        resultChange.textContent = '(无变化)';
        resultChange.className = 'result-change unchanged';
        
        riskStatus.textContent = '0 个头寸';
        riskStatus.className = 'result-status safe';
    });

    // 应用建议策略
    document.getElementById('apply-strategy').addEventListener('click', function() {
        alert('系统建议: 追加WBTC抵押品以降低清算风险，并优化资产多样性以减少波动风险。');
    });
} 