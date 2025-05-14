[⬅️ Go back to README.md](../README.md)

# Troubleshooting guide for development

- ## Tests are failing on utils.ts for the encrypt/decrypt functions

  Make sure to uncomment the following lines on top of the utils.ts so that JEST can run the tests:

  ```ts
  // import crypto from "crypto";
  // import { TextEncoder, TextDecoder } from "util";
  ```

- ## utils.ts:257 Uncaught (in promise) TypeError: util**WEBPACK_IMPORTED_MODULE_1**.TextEncoder is not a constructor

  This error occurs because NextJS can't correctly assimilate TextEncoder(). To solve it (as a temporary patch) comment the following imports in the `utils.ts` file:

  ```ts
  // import crypto from "crypto";
  // import { TextEncoder, TextDecoder } from "util";
  ```

- ## My tests, when `npm run test` are failing due to timeout

  Encryption and decryption algorithms are quite heavy and take a lot of time. This is a good sign because it means that it's well encrypted and it's hard to brute-force. Though, reduce the amount of iterations in the tests in order to run less operations.
