# web-boilerplate
Webpack/Babel boilerplate for a basic static website.

I created this while setting up my personal website, https://www.a2x.me.


### Usage

Fork, and add content-specific files:

- `assets/img/favicon.png`
- `assets/img/avatar.jpg`
- `assets/img/background.jpg`
- `assets/config.json`

Format of `config.json`:

```js
{
    "props": {
        "title": "Website Title",
        "headline": "Hello World!",
        "socialLinks": [{
            "icon": "<icon class name for foundation-icon>",
            "href": "<link>"
        }, {
            "icon": "social-linkedin",
            "href": "https://www.linkedin.com/in/alexander-biskop-811475114/"
        }]
    }
}
```

#### Build

```sh
npm install
npm run build
```

The build output will be located in the `dist` folder.

Tested with node version 8.9.1, npm version 5.5.1.


### Technologies Used

TODO 

#### Build/Content

- Webpack 3
- Babel
- [Foundation Icons](https://zurb.com/playground/foundation-icon-fonts-3)

#### Deployment

- Github Pages (link)
- AWS CloudFront (link)
- ...
