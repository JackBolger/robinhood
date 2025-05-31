# Changelog

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