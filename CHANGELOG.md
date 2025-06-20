# Changelog

## [1.5.1] - 2025-06-01
### Fixed
- **Updated TypeScript typings for the `Robinhood` class**:
  - Refined and corrected type definitions for the `Robinhood` class to improve type safety and developer experience.
  - Adjusted constructor and method typings for better integration with TypeScript tooling and stricter type checks.

## [1.5.0] - 2025-05-31
### Fixed
- **Improved ESM and CommonJS Compatibility**:
  - The build process now correctly generates separate entry points for **ESM** (`module`) and **CommonJS** (`main`) in `package.json`.
  - Ensured that TypeScript typings are properly resolved for both import styles.

## [1.4.0] - 2025-05-31
### Added  
- Introduced a default HTTP method for API requests when none is specified, improving ease of use.  
- Added support for passing a second `options` parameter to the request function, allowing users to specify request details such as `method`, `headers`, and `body`, similar to the JavaScript `fetch` API.  
- Enhanced request flexibility by enabling full control over HTTP request configuration via the new `options` parameter.

## [1.3.2] - 2025-05-31
### Fixed
- Corrected the TypeScript typing for the Robinhood class constructor to allow undefined.

## [1.3.0] - 2025-05-31
### Added
- Support for both **ESM** (`import ... from`) and **CommonJS** (`require()`) module imports.  
  - Users can now seamlessly import the package using either modern ES module syntax or traditional CommonJS syntax.  
  - This ensures compatibility across various Node.js environments and bundlers.

## [1.2.0] - 2025-03-29
### Fixed
- **Authentication Signature Fix**: Resolved an issue where authentication requests to the Robinhood API would fail due to a missing trailing `/` in the request URL.  
  - The package now **automatically appends a `/`** if it's missing, ensuring that authentication signatures are always valid.  
  - This fix prevents `401 Unauthorized` errors caused by inconsistent URL formatting.

_No breaking changes—authentication should now work as expected without requiring any manual URL adjustments._