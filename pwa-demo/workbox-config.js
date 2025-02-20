module.exports = {
    globDirectory: 'build/',
    globPatterns: [
      '**/*.{js,css,html,png,jpg,jpeg,svg,gif,woff2,woff,eot,ttf,otf}',
      'src/Assets/**/*.{png,jpg,jpeg,svg,gif}'
    ],
    swSrc: 'src/service-worker.js',
    swDest: 'build/service-worker.js',
};