export function _debug (message, force) {
    if (global.config.general.debug || force) return console.log(message)
}