const { injectManifest } = require('workbox-build');

injectManifest({
  swSrc: 'src/service-worker.js',
  swDest: 'build/service-worker.js',
  globDirectory: 'build/',
  globPatterns: [
    'static/media/**/*.{png,jpg,jpeg,svg,gif}',
    '**/*.{js,css,html,woff2,woff,eot,ttf,otf}'
  ]
}).then(({ count, size }) => {
  console.log(`Generated service worker, which will precache ${count} files, totaling ${size} bytes.`);
}).catch(console.error);