module.exports = {
  "parser": "babel-eslint",
  // "globals": {
  //   "AUTH0_CLIENT_ID": true,
  //   "AUTH0_DOMAIN": true,
  //   "GOOGLE_MAP_API_KEY": true,
  // },
  "rules": {
    "strict": 0
  },
  "env": {
    "browser": true,
    "es6": true,
    "jquery": true,
    "node": true,
    "jest/globals": true,
  },
  "extends": [
    "plugin:jsx-a11y/recommended",
    "airbnb",
    "plugin:jest/recommended",
  ],
  "parserOptions": {
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    "no-console": 0,
    "no-param-reassign": [
      "error", {
        "props": true,
        "ignorePropertyModificationsFor": ["global"]
      }
    ],
    "no-unused-expressions" : [
      "error", {
        "allowTernary": true
      }
    ],
    "react/forbid-prop-types": [
      2, {
        "forbid": ['any', 'array']
      }
    ],
  },
  "plugins": [
    "react",
    "jsx-a11y", //https://github.com/evcohen/eslint-plugin-jsx-a11y
    "jest",
  ]
};
