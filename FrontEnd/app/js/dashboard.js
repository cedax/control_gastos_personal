const ICONS = {
    EDIT: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/></svg>',
    DELETE: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/></svg>',
    SHOW: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16"><path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/><path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/></svg>',
    HIDE: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16"><path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/><path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/></svg>'
};

const CONFIG = {
    UPDATE_INTERVAL: 300000,
    API_URL: 'http://localhost:3000/api/finances',
    CURRENCY_FORMAT: {
        locale: 'es-MX',
        currency: 'MXN'
    }
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat(CONFIG.CURRENCY_FORMAT.locale, {
        style: 'currency',
        currency: CONFIG.CURRENCY_FORMAT.currency
    }).format(amount);
};

const createElement = (type, innerHTML, className = '') => {
    const element = document.createElement(type);
    element.innerHTML = innerHTML;
    if (className) element.className = className;
    return element;
};

class TableManager {
    static createActionButtons() {
        return `
            <button class="btn btn-sm btn-primary">${ICONS.EDIT}</button>
            <button class="btn btn-sm btn-danger">${ICONS.DELETE}</button>
        `;
    }

    static updateTable(tableId, data, columns) {
        console.log({
            tableId,
            data,
            columns
        });

        const tbody = document.querySelector(`#${tableId} tbody`);
        tbody.innerHTML = '';

        data.forEach(item => {
            const tr = createElement('tr', '');
            columns.forEach(column => {
                const td = createElement('td', 
                    column.format ? column.format(item[column.key]) : item[column.key]
                );
                tr.appendChild(td);
            });

            const actionsTd = createElement('td', this.createActionButtons());
            tr.appendChild(actionsTd);
            tbody.appendChild(tr);
        });
    }
}

class ChartManager {
    static instance = null;

    constructor() {
        this.chart = null;
    }

    static getInstance() {
        if (!ChartManager.instance) {
            ChartManager.instance = new ChartManager();
        }
        return ChartManager.instance;
    }

    updateChart(data) {
        const ctx = document.getElementById('balanceChart').getContext('2d');
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const gridColor = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0, 0, 0, 0.05)';

        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Balance',
                    data: data.data,
                    borderColor: '#007AFF',
                    backgroundColor: 'rgba(0, 122, 255, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#007AFF',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: this.getChartOptions(gridColor)
        });
    }

    getChartOptions(gridColor) {
        return {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    grid: {
                        color: gridColor
                    }
                }
            }
        };
    }
}

class TableVisibilityManager {
    static initialize() {
        this.setInitialIcons();
        this.setupToggleListeners();
    }

    static setInitialIcons() {
        document.querySelectorAll(".btnToggleTable")
            .forEach(button => button.innerHTML = ICONS.HIDE);
    }

    static setupToggleListeners() {
        document.querySelectorAll(".btnToggleTable").forEach(button => {
            const containerId = button.getAttribute("containerToggleTableID");
            const container = document.getElementById(containerId);

            if (container) {
                button.addEventListener("click", () => this.toggleContainer(container, button));
            } else {
                console.warn(`Container not found with ID: ${containerId}`);
            }
        });
    }

    static toggleContainer(container, button) {
        const isHidden = container.classList.contains("hidden");
        container.classList.toggle("hidden");
        button.innerHTML = isHidden ? ICONS.HIDE : ICONS.SHOW;
    }
}

class DashboardManager {
    constructor() {
        this.financial = new FinancialManager(CONFIG.API_URL);
        this.chartManager = ChartManager.getInstance();
    }

    async updateDashboard() {
        try {
            const data = await this.fetchDashboardData();
            this.updateDisplays(data);
            this.updateTables(data);
            this.updateChartData(data);
        } catch (error) {
            console.error('Error updating dashboard:', error);
        }
    }

    async fetchDashboardData() {
        const [summary, debitAccounts, loans, creditAccounts, installments, separated] = await Promise.all([
            this.financial.getSummary(),
            this.financial.debit.getAll(),
            this.financial.loans.getAll(),
            this.financial.credit.getAll(),
            this.financial.installments.getCurrent(),
            this.financial.separated.getAll()
        ]);

        return { summary, debitAccounts, loans, creditAccounts, installments, separated };
    }

    updateDisplays(data) {
        const { summary, separated } = data;
        const separatedTotal = separated.reduce((acc, item) => acc + item.amount, 0);

        document.getElementById('totalDebit').textContent = formatCurrency(summary.debitNet);
        document.getElementById('totalLoans').textContent = formatCurrency(summary.loans);
        document.getElementById('totalCredit').textContent = formatCurrency(summary.credit);
        document.getElementById('totalSeparated').textContent = formatCurrency(separatedTotal);
        document.getElementById('totalDisponible').textContent = 
            formatCurrency(summary.debitNet - summary.credit - separatedTotal);
    }

    updateTables(data) {
        const tableConfigs = {
            debitTable: {
                data: data.debitAccounts,
                columns: [
                    { key: 'name' },
                    { key: 'amount', format: formatCurrency }
                ]
            },
            loansTable: {
                data: data.loans,
                columns: [
                    { key: 'person' },
                    { key: 'amount', format: formatCurrency }
                ]
            },
            creditTable: {
                data: data.creditAccounts,
                columns: [
                    { key: 'name' },
                    { key: 'debt', format: formatCurrency }
                ]
            },
            separatedTable: {
                data: data.separated,
                columns: [
                    { key: 'concept' },
                    { key: 'amount', format: formatCurrency }
                ]
            }
        };

        Object.entries(tableConfigs).forEach(([tableId, config]) => {
            TableManager.updateTable(tableId, config.data, config.columns);
        });
    }

    updateChartData(data) {
        const separatedTotal = data.separated.reduce((acc, item) => acc + item.amount, 0);
        
        this.chartManager.updateChart({
            labels: ['Débito', 'Préstamos', 'Crédito', 'Separado'],
            data: [
                data.summary.debitNet,
                data.summary.loans,
                data.summary.credit,
                separatedTotal
            ]
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    TableVisibilityManager.initialize();
    const dashboard = new DashboardManager();
    
    dashboard.updateDashboard();
    setInterval(() => dashboard.updateDashboard(), CONFIG.UPDATE_INTERVAL);
});