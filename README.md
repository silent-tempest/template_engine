# tmpl

A Node.js (ES2015) View Engine with syntax close to EJS.

### Documentation

[Documentation](https://tikhiy.github.io/tmpl/).

### Installation

* `npm install --save github:tikhiy/tmpl#next`
* `npm install --save github:tikhiy/tmpl#v3.0.0`

### Features

| Syntax | Description                     | Example                       | Result              |
| ------ | ------------------------------- | ----------------------------- | ------------------- |
| `<%=`  | Inserts the HTML-escaped value. | `<%= '1st, & 2nd...' %>`      | `1st, &amp; 2nd...` |
| `<%-`  | Inserts the value.              | `<%- Math.PI.toFixed( 2 ) %>` | `3.14`              |
| `<%`   | A block of code.                | `<% print( 'A code...' ); %>` | `A code...`         |
| `<%#`  | A comment.                      | `<%# A comment. %>`           | *No Output...*      |

### Example

1. Import.

```javascript
var ViewEngine = require( 'tmpl' ).ViewEngine;
```

2. Create.

```javascript
var engine = new ViewEngine();
```

3. Render.

`views/layout.tmpl`

```html
<!DOCTYPE html>
<html>
<head>
  <title>tmpl</title>
</head>
<body>
  <%# Insert rendered content. %>
  <%- data.content %>
</body>
</html>
```

`views/greet.tmpl`

```html
<%# Escape and insert "name". %>
<h1>Hello <%= data.name %>!</h1>
```

```javascript
var html = engine.render( 'greet', {
  name: 'T'
} );
```

### Development

##### Linting

* `npm run lint`

##### Testing

* `npm run test` or `npm test`

##### Before committing

* `npm run prepublish`

### License

Released under the [MIT](LICENSE) license.
