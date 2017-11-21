# web-boilerplate
Webpack/Babel boilerplate for a basic static website.

I created this while setting up my [personal website](https://www.a2x.me).


### Usage

Fork, clone and add content-specific files:

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

Most of these are obviously complete overkill for a website this simple. I am however using this as a playground/showcase for these technologies and a way for me to experiment and learn more about them.

#### Build/Content

- Webpack 3
- Babel
- [Foundation Icons](https://zurb.com/playground/foundation-icon-fonts-3)

#### Deployment

- [Github Pages](https://pages.github.com/)
- [Travis CI](https://docs.travis-ci.com/user/deployment/pages/) for pushing to Github Pages
- [AWS CloudFront](https://aws.amazon.com/cloudfront/)

#### Misc

- I attempted to incorporate ~~most of~~ the low-hanging fruits from [David Dias' front-end checklist](https://github.com/thedaviddias/Front-End-Checklist).
