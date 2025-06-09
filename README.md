# Witty Weasel

![favicon](public/favicon.png)

The sneaky little companion you never knew you needed for building bookmarklets.

> funny.
>
> as hell.

## installation

```bash
npm install -g witty-weasel
```

## usage


```bash
# cd /path/to/my/bookmarklet/source
witty-weasel
```

### 🧩 Using external libraries (like lodash)

Need lodash? No problem.

Just install it in your bookmarklet folder:

```bash
npm install lodash
```

Then in your code:

```javascript
import _ from 'lodash';

console.log(_.shuffle([1, 2, 3, 4]));
```

Witty Weasel takes care of bundling everything into a single, minified bookmarklet.

### 🛠 Dev Bookmarklet

While developing, drag the DEV BOOKMARKLET into your bookmarks bar.

Fetch the latest version of your script from your local server, no copy-paste needed.

## want?

Want unreasonably smooth bookmarklet dev?
Weasel it