# Left-over-spa

Project of Kasia, Ola and Piotr

![alt text](https://mir-s3-cdn-cf.behance.net/project_modules/disp/09f37545677313.5838e5ef4c6de.gif)

# commands

## Installation

Before you use the code run

```bash
npm i
```

You might also need to install gulp-cli globaly

```bash
npm i gulp-cli -g
```

## TailwindCSS

To make your life easier add this extension to your VSC [TailwindCSS intelisense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

If you have made some changes in tailwind.config.js file before being able to use them please run this command

```bash
npm run build-tailwind
```

## SASS

When you want to add styles or update them use Gulp it's awesome and merges all sass files together into one :)

Also it will watch for changes in the scss files and compile, minifiy and bundle them at once.

```bash
gulp
```
