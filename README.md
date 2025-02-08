# api-robinhood

Easily authenticate and interact with Robinhood's API using the `api-robinhood` package. This package authenticates to Robhinhood APIs usiing your private key and API key generated for your account. You can read more about the Robinhood APIs at [this link](https://docs.robinhood.com/crypto/trading/).

## Installation

Install the package via npm:

```sh
npm install api-robinhood
```

or using Yarn:

```sh
yarn add api-robinhood
```

## Usage

The `Robinhood` class allows developers to establish an authenticated connection to Robinhood's APIs.

### Import and Initialize

```ts
import Robinhood from "api-robinhood";

const robinhood = new Robinhood(
    {
        apiKey: "your_api_key",
        privateKey: "your_private_key"
    }
);

// OR

const robinhood = new Robinhood();

robinhood.setApiKey("your_api_key");
robinhood.setPrivateKey("your_private_key");
```

### Send Requests

```ts
await robinhood.request("/api/v1/crypto/trading/accounts");
```

## Contributing

Feel free to open issues or submit pull requests to enhance the package.

## License

MIT