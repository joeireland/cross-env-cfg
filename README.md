<div align="center">
<h1>cross-env-cfg</h1>

Run scripts that use Node.js configuration and environment variables across platforms.

This is a fork of `cross-env` that is modified to include a Node.js configuration file in addition to environment variables.

</div>

<hr />

## The problem

Most Windows command prompts will choke when you set environment variables with
`NODE_ENV=production` as a prefix to the command invoked (The exception is [Bash on Windows][win-bash],
which uses native Bash). Instead of prefixing commands with environment variables, it is more concise and powerful to specify a Node.js configuration file.

## This solution

`cross-env-cfg` allows you to have a single command without worrying about
setting or using environment variables properly for the platform. `cross-env-cfg` allows you to specify a Node.js configuration file (like config.js), and use a mustache-like syntax to refer to variables it defines. For example, within package.json you may execute a script referencing {{config.VAR1}} on its command line and that value may be defined within config.js as follows:

```
config = {
  VAR1 = process.env.VAR1 || 'DEFAULT_VAR1_VALUE';
  VAR2 = process.env.VAR2 || 'DEFAULT_VAR2_VALUE';
  VAR3 = process.env.VAR3 || 'DEFAULT_VAR3_VALUE';
}

modules.exports = config;
```

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Usage](#usage)
- [`cross-env-cfg` vs `cross-env-cfg-shell`](#cross-env-cfg-vs-cross-env-cfg-shell)
- [Windows Issues](#windows-issues)
- [Inspiration](#inspiration)
- [Other Solutions](#other-solutions)
- [Contributors](#contributors)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `devDependencies`:

```
npm install --save-dev cross-env-cfg
```

> WARNING! Make sure that when you're installing packages that you spell things
> correctly to avoid [mistakenly installing malware][malware]

## Usage

The following shows an example of how to use `cross-env-cfg`. 

```json
{
  "scripts": {
    "myCommand": "cross-env-cfg config.js echo EnvVar=$ENV_VAR1 ConfigVar={{config.VAR1}}"
  }
}
```

Where config.js is defined as follows:

```
config = {
  VAR2 = 'VALUE2'
}

modules.exports = config;
```

Ultimately, the command that is executed (using [`cross-spawn`][cross-spawn])
is shown below assuming the environment variable ENV_VAR1=VALUE1 and the config.js file defines config.VAR2 = VALUE2:

```
echo EnvVar=VALUE1 ConfigVar=VALUE2
```

## Other Solutions

- [`env-cmd`](https://github.com/toddbluhm/env-cmd) - Reads environment
  variables from a file instead
- [`@naholyr/cross-env`](https://www.npmjs.com/package/@naholyr/cross-env) -
  `cross-env` with support for setting default values

## LICENSE

MIT

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[cross-spawn]: https://www.npmjs.com/package/cross-spawn
[malware]:
  http://blog.npmjs.org/post/163723642530/crossenv-malware-on-the-npm-registry
