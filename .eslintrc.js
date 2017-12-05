module.exports = {
  "extends": "airbnb-base",
  "env": {
    "browser": true
  },
  "plugins": ["html"],
  "globals": {
    "html": false,
    "render": false,
    "LionLitElement": false,
    "PaperRipple": false,
  },
  "rules": {
    "no-console": ["error", {
      allow: ["warn", "error"]
    }],
    "no-underscore-dangle": [2, {
      "allowAfterThis": true
    }],

    "class-methods-use-this": 0,
  }
};
