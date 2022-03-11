# Nunjucks Render

[![Build][github-actions-image]][github-actions-url]
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

This extensions allows you to render another template inside an template. This works like 
the [include](https://mozilla.github.io/nunjucks/templating.html#include) tag, but you can supply
parameters to the template and optionally access the Nunjucks context.

### How to install it?

```
$ npm install nunjucks-render
```

### How to use it?

```js
import { RenderExtension } from 'nunjucks-render';

env.addExtension(
  'render-extension',
  new RenderExtension({
    environment: env,
    templatePath: 'path/to/template/root',
  }),
);
```

### Parameters for RenderExtension constructor

| Name         | Type | Description                      |
|--------------| --- |----------------------------------|
| environment  | `Environment` | Instance of Nunjucks environment |
| templatePath | `String` | Path to template files           |

### Usage in Templates

To render another template in your template use the `render` tag. The syntax is
`{% render <template file>, <data object> [, <options>] %}`

The `options` object is optional. With `{ includeContext: true }`, you have access to the Nunjucks Context inside the
template. Use the `context` variable for access the context.
<br><br>

__Template `subtemplate.html.njk`:__

```html
This is the param value: {{ param }}.
```
<br>
You can render this sub template like the following in another template:

```html
{% render 'subtemplate.html.njk', { param: 'param value' }, { includeContext: true } %}
```

<br>
The output will be:

````text
This is the param value: param value.
````

[npm-image]: https://img.shields.io/npm/v/nunjucks-render.svg?label=NPM%20Version
[npm-url]: https://npmjs.org/package/nunjucks-render
[downloads-image]: https://img.shields.io/npm/dt/nunjucks-render?label=Downloads
[downloads-url]: https://npmjs.org/package/nunjucks-render
[github-actions-image]: https://img.shields.io/github/workflow/status/mgascoyne/nunjucks-render/Tests/master?label=Build
[github-actions-url]: https://github.com/mgascoyne/nunjucks-render/actions
