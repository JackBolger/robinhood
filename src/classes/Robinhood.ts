const nacl = require("tweetnacl");
const base64 = require("base64-js");

export default class Robinhood {
    private privateKey: string;
    private apiKey: string;

    private method: string;
    private headers: {};
    private body: string;

    constructor(
        options: {
            apiKey: string,
            privateKey: string,
            method: string,
            headers: {},
            body: {} | string
        } = {
            apiKey: "",
            privateKey: "",
            method: "GET",
            headers: {},
            body: null
        }
    ) {
        const { apiKey, privateKey, method, headers, body } = options;
        
        if (apiKey) this.setApiKey(apiKey);
        if (privateKey) this.setPrivateKey(privateKey);
        if (method) this.setMethod(method);
        if (headers) this.setHeaders(headers);
        if (body) this.setBody(body);
    }

    setPrivateKey(privateKey: string) {
        this.privateKey = privateKey;
    }

    setApiKey(apiKey: string) {
        this.apiKey = apiKey;
    }

    setMethod(method: string) {
        this.method = method;
    }

    setHeaders(headers: {}) {
        this.headers = headers;
    }

    setBody(body: {} | string) {
        this.body = typeof body === "string" ? body : JSON.stringify(body);
    }

    #getPrivateKey() {
        return this.privateKey;
    }

    #getApiKey() {
        return this.apiKey;
    }

    #getMethod() {
        return this.method;
    }

    #getHeaders() {
        return this.headers;
    }

    #getBody() {
        return this.body;
    }

    #getAuthenticationHeaders(path: string) {
        const [
            privateKey,
            apiKey,
            method,
            body
        ] = [
            this.#getPrivateKey(),
            this.#getApiKey(),
            this.#getMethod(),
            this.#getBody()
        ];

        if (!privateKey) throw new Error("Private key is required.");
        if (!apiKey) throw new Error("API Key is requried.");

        const now = new Date();
        const timestamp = Math.floor(now.getTime() / 1000).toString();

        const message = `${apiKey}${timestamp}${path}${method}${body || ""}`;

        try {

            // Convert private key back from Base64 to UInt8Array
            const privateKeyByteArray = base64.toByteArray(privateKey);
    
            // Sign the message using the private key
            const signature = nacl.sign.detached(Buffer.from(message), privateKeyByteArray);
    
            return {
                'x-signature': base64.fromByteArray(signature),
                'x-api-key': apiKey,
                'x-timestamp': timestamp
            }
        } catch (err) {
            console.log(err);
        }
    }

    async request(url: string) {
        const urlObject = new URL(url, "https://trading.robinhood.com");

        const [
            method,
            headers,
            body,
            authenticationHeaders
        ] = [
            this.#getMethod(),
            this.#getHeaders(),
            this.#getBody(),
            this.#getAuthenticationHeaders(urlObject.pathname)
        ];

        for (const [key, value] of Object.entries(authenticationHeaders)) {
            headers[key] = value;
        }

        return await fetch(`https://trading.robinhood.com${urlObject.pathname}${urlObject.search || ""}`,
            {
                method: method,
                headers: headers,
                body: body
            }
        )
    }
}

module.exports = Robinhood;