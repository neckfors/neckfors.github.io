# neckfors.github.io

My hub page: **https://neckfors.github.io**

It lists my public apps and games automatically. Any public repo with GitHub Pages turned on shows up as a row that opens the live app. Repos with the topic `game` go under Games, everything else under Apps. Forks, archived repos, repos with the topic `hidden` and this repo are left out. No edits are needed when I add a new app.

Plain HTML, CSS and JS, no build step. One column: Games first, then Apps. Each row has small labels: "Web" (opens the live app), plus "Phone" when the app has an install file (manifest), found automatically (except Type Blaster, listed in `NO_INSTALL` in app.js). Every row has an "About" link to the project's README on GitHub. Repos with the topic `apk` also get an "APK" link to the newest release, where the APK is downloaded. A public repo with the topic `apk` and no Pages site is listed too (Android only): the whole row opens the README, and `-releases` is left out of its name. Repos with the topic `windows` are listed the same way, with a "Windows" link to the newest release. A name that doesn't come out right from the repo name is set in `NAMES` in app.js. Each row shows the icon the app or game is installed with (`icons/<repo>.png`, listed in `PICS` in app.js; a repo without one gets an emoji). A slow dark gradient background, a still gradient title, and simple hover effects. Works on phones.

## Support

If you like the app, you can support the author on [PayPal](https://paypal.me/neckfors). Thank you!
