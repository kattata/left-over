# Left-over-spa

Project of Kasia, Ola and Piotr

![alt text](https://mir-s3-cdn-cf.behance.net/project_modules/disp/09f37545677313.5838e5ef4c6de.gif)

# commands

Note that those apply ONLY if you want to change the code
if you want to open it on your local machine just run PHP serwer on index.html and you all good

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
npm run gulp-watch
```

## Before sending the code online

It's important that you run the command belowe so that postcss can purge all the unused data, otherwise you are going to have 200k+ lines of css :)

```bash
npm run build
```

# Coding structure

## Test users

- **Email**: sofienielsen@gmail.com
- **Password**: sofie99

## File structure

- public/styles/ -> bundled scss and purged tailwind classes
- src/styles/ -> tailwind.scss file and all scss that gets bundled by gulp
- src/backend/json -> all json files we used
- src/backend/ -> all php files used to comunicate with MySQL and frontend
- src/frontend/ -> router.js and all JavaScript used on a website divided by functionality
- src/media/ -> all media files images,icons as well as pictures from the backend
- tailwind.config.js -> Tailwind configuration file with all the styles
- postcss.config.js -> PostCss and PostCss cli config file used with TailwindCss to optimalize it
- gulpfile.js -> Gulp config file with watchers and compiling tasks setup
- index.html -> starting point of a solution and all the HTML
