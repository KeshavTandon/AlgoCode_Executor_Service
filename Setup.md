## How to setup a new Typescript Express project

1. 
```
npm init -y
```

2.
```
npm install typescript
npm install concurrently
```

3.
```
npx --package typescript tsc --init 
```

4.
```
Add following steps in package.json
{
    "build": "npx tsc",
    "watch": "npx tsc -w",
    "prestart": "npm run build",
    "start": "npx nodemon dist/index.js",
    "dev": "npx concurrently --kill-others \"npm run watch\" \"npm run start\" "
}
```

Note:Make relevant config changes in ts.config.json

5.
```
npm run dev
```

