module.exports = {
    "env": {
        "browser": true,
		"node": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "rules": {
		"no-fallthrough": 0,
		"no-debugger": 0,
		"no-case-declarations": 0
    }
}

