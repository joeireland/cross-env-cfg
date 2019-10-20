const {spawn}    = require('cross-spawn');
const cmdConvert = require('./command');

const configVarRegex = /(.*)[{][{](.+)[}][}](.*)/

function configEnv(args, options = {}) {
  const [config, command, cmdArgs] = parseCommand(args);
  const env = getEnvVars(config);

  if (!command) {
    return null;
  }

  const spawnOptions = {
    stdio: 'inherit',
    shell: options.shell,
    env
  };

  const proc = spawn(
    cmdConvert(command, env, true), // run "path.normalize" for command(on windows)
    setConfigAndEnvVars(cmdArgs, env),  // normalize is "false" by default - not run for cmd args
    spawnOptions
  );

  process.on('SIGTERM',  () => proc.kill('SIGTERM'));
  process.on('SIGINT',   () => proc.kill('SIGINT'));
  process.on('SIGBREAK', () => proc.kill('SIGBREAK'));
  process.on('SIGHUP',   () => proc.kill('SIGHUP'));

  proc.on('exit', (code, signal) => {
    let exitCode = code;

    if (exitCode === null) { // Ensure exitCode is 0 if user interrupts process
      exitCode = (signal === 'SIGINT') ? 0 : 1;
    }

    process.exit(exitCode); //eslint-disable-line no-process-exit
  });

  return proc;
}

function parseCommand(args) {
  if (args.length < 2) {
    return [null, null, []];
  }

  const config   = args[0];
  const cmdStart = args.slice(1).map(a => {
    // Regex: match "\'" or "'" or match "\" if followed by [$"\] (lookahead)
    const re = /\\\\|(\\)?'|([\\])(?=[$"\\])/g

    // Eliminate all matches except for "\'" => "'"
    return a.replace(re, m => {
      if (m === '\\\\') {
        return '\\';
      }
      else if (m === "\\'") {
        return "'";
      }

      return '';
    });
  });

  return [config, cmdStart[0], cmdStart.slice(1)];
}

function getEnvVars(config) {
  const envVars    = {...process.env};
  const configVars = require(`${__dirname}/../../../${config}`);

  Object.keys(configVars).forEach(varName => {
    envVars[`config.${varName}`] = configVars[varName];
  });

  return envVars;
}

function setConfigAndEnvVars(args, env) {
  const resultArgs = [];

  args.map(arg => {
    let matches = null;

    do {
      matches = arg.match(configVarRegex);

      if (matches) {
        const value = env[matches[2]];
        arg = matches[1] + (value ? value : '') + matches[3];
      }
    } while (matches);

    return resultArgs.push(cmdConvert(arg, env));
  });

  return resultArgs;
}

module.exports = configEnv;