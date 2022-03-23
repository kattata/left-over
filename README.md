# Left Over

- Student project developed in a group of 3
- Goal: Practice full stack web development. The application helps people connect to exchange food products and meals in order to reduce food waste.
- Stack: JavaScript, PHP, MySQL, Tailwind, Gulp, SASS

## Test users

- **Email**: sofienielsen@gmail.com
- **Password**: sofie99

# Installation

Note that the commands below apply only if you want to change the code.

If you want to open it on your local machine, run the code with PHP server from index.html.

## Gulp and npm

Before you use the code, run

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

When you want to add styles or update them use Gulp to merge all SASS files together into one

Also it will watch for changes in the SCSS files to compile, minify and bundle them.

```bash
npm run gulp-watch
```

## Deployment

Run the command below for PostCSS to purge all the unused data and avoid excess CSS.

```bash
npm run build
```

# File structure

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
