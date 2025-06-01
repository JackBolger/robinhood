import nacl from "tweetnacl";
import base64 from "base64-js";

type Headers = Record<string, string>;
type Body = Record<string, any> | string;

export default class Robinhood {
    private privateKey: string;
    private apiKey: string;

    private method: string;
    private headers: Headers;
    private body: Body;

    constructor(
        options: {
            apiKey?: string,
            privateKey?: string,
            method?: string,
            headers?: Headers,
            body?: Body
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
        this.method = method.toUpperCase();
    }

    setHeaders(headers: Headers) {
        this.headers = headers;
    }

    setBody(body: Body) {
        this.body = typeof body === "string" ? body : JSON.stringify(body);
    }

    #getPrivateKey(): string | undefined {
        return this.privateKey;
    }

    #getApiKey(): string | undefined {
        return this.apiKey;
    }

    #getMethod(): string | undefined {
        return this.method;
    }

    #getHeaders(): Headers | undefined {
        if (!this.headers) {
            this.setHeaders({});
        }

        return this.headers;
    }

    #getBody(): Body | undefined {
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

        const timestamp = Math.floor(Date.now() / 1000).toString();

        const message = `${apiKey}${timestamp}${path}${method}${body ? JSON.stringify(body) : ""}`;

        try {

            // Convert private key back from Base64 to UInt8Array
            const privateKeyByteArray = base64.toByteArray(privateKey);
                
            // Sign the message using the private key
            const signature = nacl.sign.detached(Buffer.from(message, "utf-8"), privateKeyByteArray);
    
            return {
                'x-signature': base64.fromByteArray(signature),
                'x-api-key': apiKey,
                'x-timestamp': timestamp
            }
        } catch (err) {
            console.log(err);
        }
    }

    async request(
        url: string,
        options: {
            method?: string;
            headers?: Headers;
            body?: Body;
        } = {
            method: "GET"
        }
    ) {
        const urlObject = new URL(url, "https://trading.robinhood.com");
        const path = urlObject.pathname + 
            (urlObject.pathname.endsWith("/") ? "" : "/") +
            urlObject.search;

        if (options?.method) this.setMethod(options.method);
        if (options?.headers) this.setHeaders(options.headers);
        if (options?.body) this.setBody(options.body);

        const [
            method,
            headers,
            body,
            authenticationHeaders
        ] = [
            this.#getMethod(),
            this.#getHeaders(),
            this.#getBody(),
            this.#getAuthenticationHeaders(path)
        ];

        for (const [key, value] of Object.entries(authenticationHeaders)) {
            headers[key] = value;
        }

        const params: {
            method: string;
            headers: Headers;
            body?: string;
        } = {
            method: method,
            headers: headers
        }

        if (typeof body !== "undefined") {
            params.body = typeof body === "string" ? body : JSON.stringify(body);
        }

        return await fetch(`https://trading.robinhood.com${path || ""}`, params)
    }
}