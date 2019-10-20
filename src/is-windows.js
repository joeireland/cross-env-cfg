const cygwinRegex = /^(msys|cygwin)$/

function isWindows() {
  return (process.platform === 'win32') || cygwinRegex.test(process.env.OSTYPE);
}

module.exports = isWindows;