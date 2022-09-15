const crypto = require('crypto');  // this package does not need to install
const key = crypto.randomBytes(32).toString('hex').toUpperCase();
console.log(key);

// for console.log we should do in terminal: cd app => cd utils => node secret_key_generator.js

// E7262F728682474E53063EF2DDB5B5B9A1F8B5F761BB5426906105465E460B9B   using this for SECRET_KEY

// 6EEC299FA4E6B755E7BD0BA703B3F302CD2DFD912FE1C8C93B03AF6E83CB7B71   using this for REFRESH_TOKEN