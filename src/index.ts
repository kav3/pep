export default class Client {
    private ipg: { exp: number, token?: string } = { exp: 0 }
    constructor(private readonly options: { terminal: number, username: string, password: string, callback: string, base?: string, exp?: number }) {

        if (!this.options.base)
            this.options.base = "https://pep.shaparak.ir/dorsa1"

        if (!this.options.exp)
            this.options.exp = 15 * 60 * 1000 // 15 minutes
    }

    async get() {
        const { username, password, base } = this.options

        if (!username || !password || !base)
            throw Error("error.need-init-data")

        if (!this.ipg || this.ipg.exp < Date.now()) {
            this.ipg = await fetch(`${base}/token/getToken`, { method: "POST", body: JSON.stringify({ username, password }) }).then(x => x.json())
            // If you want the actual expiration time, you should decode the token using a JWT decoder like @kav3/jwt, but i prefer not to use a third-party module ;)
            this.ipg.exp = Date.now() + (this.options.exp ?? 14.9 * 60 * 1000)
        }

        return this.ipg
    }

    async purchase(options: { amount: number, invoice: string, invoiceDate?: string, description?: string, mobileNumber?: string, serviceType?: string, payerMail?: string, payerName?: string, paymentCode?: string, nationalCode?: string, pans?: string }) {

        if (!options.invoiceDate)
            options.invoiceDate = new Date().toISOString()

        const { base, callback: callbackApi, terminal: terminalNumber } = this.options
        const { amount, invoice } = options

        if (!amount || !invoice)
            throw Error("error.need-init-data")

        const { token } = await this.get()

        return fetch(`${base}/api/payment/purchase`, {
            method: "POST", body: JSON.stringify({ callbackApi, terminalNumber, serviceCode: 8, serviceType: "PURCHASE", ...options }), headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(x => x.json())
    }

    async inquiry(invoiceId: string) {
        const { base } = this.options

        if (!invoiceId)
            throw Error("error.need-init-data")

        const { token } = await this.get()

        return fetch(`${base}/api/payment/payment-inquiry`, {
            method: "POST", body: JSON.stringify({ invoiceId }), headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(x => x.json())
    }

    async confirm(options: { invoice?: string, urlId?: string }) {
        const { base } = this.options

        const { invoice, urlId } = options

        if (!invoice || !urlId)
            throw Error("error.need-init-data")

        const { token } = await this.get()

        return fetch(`${base}/api/payment/confirm-transactions`, {
            method: "POST", body: JSON.stringify(options), headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(x => x.json())
    }

    async verify(options: { invoice?: string, urlId?: string }) {
        const { base } = this.options

        const { invoice, urlId } = options

        if (!invoice || !urlId)
            throw Error("error.need-init-data")

        const { token } = await this.get()

        return fetch(`${base}/api/payment/verify-payment`, {
            method: "POST", body: JSON.stringify(options), headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(x => x.json())
    }

    async reverse(options: { invoice?: string, urlId?: string }) {
        const { base } = this.options

        const { invoice, urlId } = options

        if (!invoice || !urlId)
            throw Error("error.need-init-data")

        const { token } = await this.get()

        return fetch(`${base}/api/payment/reverse-transactions`, {
            method: "POST", body: JSON.stringify(options), headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(x => x.json())
    }
}