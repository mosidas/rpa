# rpa nutsjs版

## init

```sh
npm init -y 
npm install --save-dev typescript 
npm install --save-dev @types/node
npm install --save-dev @tsconfig/node22
npm install --save-dev --save-exact @biomejs/biome
npx tsc --init
npx @biomejs/biome init
```

`tsconfig`
```json
{
  "extends": "@tsconfig/node22/tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "types": [],
    "lib":["DOM", "es2024", "ESNext.Array", "ESNext.Collection", "ESNext.Iterator"],

    // Stricter Typechecking Options
    "noUncheckedIndexedAccess": true,            // インデックスアクセス時に 'undefined' を型に追加
    "strictNullChecks": true,                    // nullおよびundefinedの厳密な型チェックを有効化
    "exactOptionalPropertyTypes": true,          // オプショナルプロパティを厳密に解釈（'undefined' を自動追加しない）
    "noPropertyAccessFromIndexSignature": true   // インデックスシグネチャで宣言されたキーには配列記法でのアクセスを強制
  },
    "include": [
    "src/**/*.ts",
    "src/**/*.tsx"
  ]
}
```

`package.json`
```diff:package.json
"scripts": {
+   "start": "npm run build && node ./dist/index.js",
+   "build": "npx tsc",
+   "test": "echo \"Error: no test specified\" && exit 1",
+   "lint": "biome lint ./src",
+   "lint:ci": "biome lint ./src --diagnostic-level=error",
+   "check": "biome check ./src",
+   "check:ci": "biome check ./src --diagnostic-level=error",
+   "format": "biome format ./src",
+   "format:fix": "biome format --write ./src"
},
```

## nutsjs setup
