let defaultResolver

function requireDefaultResolver() {
    if (!defaultResolver) {
        try {
            defaultResolver = require(`jest-resolve/build/defaultResolver`).default
        } catch (error) {
            defaultResolver = require(`jest-resolve/build/default_resolver`).default
        }
    }

    return defaultResolver
}

function resolveWithTypeScript(resolver, request, options) {
    let error
    for (const ext of [".ts", ".tsx"]) {
        try {
            const result = resolver(request.replace(/\.js$/, ext), options)
            return result
        } catch (err) {
            error = err
        }
    }
    throw error
}

module.exports = (request, options) => {
    let { defaultResolver: resolver } = options

    if (!resolver) {
        resolver = requireDefaultResolver()
    }

    try {
        return resolver(request, options)
    } catch (e) {
        return resolveWithTypeScript(resolver, request, options)
    }
}
