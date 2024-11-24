class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async request(endpoint, method = 'GET', body) {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: body ? JSON.stringify(body) : undefined,
        });

        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message || 'Error en la solicitud');
        }

        return data.data;
    }
}

class DebitAccountManager extends ApiClient {
    async getAll() {
        return this.request('/debit');
    }

    async add(account) {
        return this.request('/debit', 'POST', account);
    }

    async update(name, amount) {
        return this.request(`/debit/${name}`, 'PUT', { amount });
    }

    async delete(name) {
        return this.request(`/debit/${name}`, 'DELETE');
    }
}

class LoanManager extends ApiClient {
    async getAll() {
        return this.request('/loans');
    }

    async add(loan) {
        return this.request('/loans', 'POST', loan);
    }

    async update(person, amount) {
        return this.request(`/loans/${person}`, 'PUT', { amount });
    }

    async delete(person) {
        return this.request(`/loans/${person}`, 'DELETE');
    }
}

class CreditAccountManager extends ApiClient {
    async getAll() {
        return this.request('/credit');
    }

    async add(account) {
        return this.request('/credit', 'POST', account);
    }

    async update(name, updates) {
        return this.request(`/credit/${name}`, 'PUT', updates);
    }

    async delete(name) {
        return this.request(`/credit/${name}`, 'DELETE');
    }
}

class InstallmentManager extends ApiClient {
    async getAll() {
        return this.request('/installments');
    }

    async add(payment) {
        return this.request('/installments', 'POST', payment);
    }

    async getCurrent() {
        return this.request('/installments/current');
    }
}

class SeparatedItemManager extends ApiClient {
    async getAll() {
        return this.request('/separated');
    }

    async add(item) {
        return this.request('/separated', 'POST', item);
    }

    async update(concept, amount) {
        return this.request(`/separated/${concept}`, 'PUT', { amount });
    }

    async delete(concept) {
        return this.request(`/separated/${concept}`, 'DELETE');
    }
}

class FinancialManager {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.debit = new DebitAccountManager(baseUrl);
        this.loans = new LoanManager(baseUrl);
        this.credit = new CreditAccountManager(baseUrl);
        this.installments = new InstallmentManager(baseUrl);
        this.separated = new SeparatedItemManager(baseUrl);
    }

    async getSummary() {
        const apiClient = new ApiClient(this.baseUrl);
        return apiClient.request('/summary');
    }
}

window.FinancialManager = FinancialManager;