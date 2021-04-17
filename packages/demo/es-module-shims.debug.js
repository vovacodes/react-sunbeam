/* ES Module Shims 0.10.5 */
;(function () {
    const resolvedPromise = Promise.resolve()

    let baseUrl

    function createBlob(source, type = "text/javascript") {
        return URL.createObjectURL(new Blob([source], { type }))
    }

    const hasDocument = typeof document !== "undefined"

    // support browsers without dynamic import support (eg Firefox 6x)
    let supportsDynamicImport = false
    let dynamicImport
    try {
        dynamicImport = (0, eval)("u=>import(u)")
        supportsDynamicImport = true
    } catch (e) {
        if (hasDocument) {
            let err
            self.addEventListener("error", (e) => (err = e.error))
            dynamicImport = (blobUrl) => {
                const topLevelBlobUrl = createBlob(`import*as m from'${blobUrl}';self._esmsm=m`)
                const s = document.createElement("script")
                s.type = "module"
                s.src = topLevelBlobUrl
                document.head.appendChild(s)
                return new Promise((resolve, reject) => {
                    s.addEventListener("load", () => {
                        document.head.removeChild(s)
                        if ("_esmsm" in self) {
                            resolve(self._esmsm, baseUrl)
                            delete self._esmsm
                        } else {
                            reject(err)
                        }
                    })
                })
            }
        }
    }

    let supportsImportMeta = false
    let supportsImportMaps = false

    const featureDetectionPromise = Promise.all([
        dynamicImport(createBlob("import.meta")).then(() => (supportsImportMeta = true)),
        supportsDynamicImport &&
            hasDocument &&
            new Promise((resolve) => {
                self._$s = (v) => {
                    document.body.removeChild(iframe)
                    if (v) supportsImportMaps = true
                    delete self._$s
                    resolve()
                }
                const iframe = document.createElement("iframe")
                iframe.style.display = "none"
                iframe.src = createBlob(
                    `<script type=importmap>{"imports":{"x":"data:text/javascript,"}}<${""}/script><script>import('x').then(()=>1,()=>0).then(v=>parent._$s(v))<${""}/script>`,
                    "text/html"
                )
                document.body.appendChild(iframe)
            }),
    ])

    if (hasDocument) {
        const baseEl = document.querySelector("base[href]")
        if (baseEl) baseUrl = baseEl.href
    }

    if (!baseUrl && typeof location !== "undefined") {
        baseUrl = location.href.split("#")[0].split("?")[0]
        const lastSepIndex = baseUrl.lastIndexOf("/")
        if (lastSepIndex !== -1) baseUrl = baseUrl.slice(0, lastSepIndex + 1)
    }

    const backslashRegEx = /\\/g
    function resolveIfNotPlainOrUrl(relUrl, parentUrl) {
        // strip off any trailing query params or hashes
        parentUrl = parentUrl && parentUrl.split("#")[0].split("?")[0]
        if (relUrl.indexOf("\\") !== -1) relUrl = relUrl.replace(backslashRegEx, "/")
        // protocol-relative
        if (relUrl[0] === "/" && relUrl[1] === "/") {
            return parentUrl.slice(0, parentUrl.indexOf(":") + 1) + relUrl
        }
        // relative-url
        else if (
            (relUrl[0] === "." &&
                (relUrl[1] === "/" ||
                    (relUrl[1] === "." && (relUrl[2] === "/" || (relUrl.length === 2 && (relUrl += "/")))) ||
                    (relUrl.length === 1 && (relUrl += "/")))) ||
            relUrl[0] === "/"
        ) {
            const parentProtocol = parentUrl.slice(0, parentUrl.indexOf(":") + 1)
            // Disabled, but these cases will give inconsistent results for deep backtracking
            //if (parentUrl[parentProtocol.length] !== '/')
            //  throw new Error('Cannot resolve');
            // read pathname from parent URL
            // pathname taken to be part after leading "/"
            let pathname
            if (parentUrl[parentProtocol.length + 1] === "/") {
                // resolving to a :// so we need to read out the auth and host
                if (parentProtocol !== "file:") {
                    pathname = parentUrl.slice(parentProtocol.length + 2)
                    pathname = pathname.slice(pathname.indexOf("/") + 1)
                } else {
                    pathname = parentUrl.slice(8)
                }
            } else {
                // resolving to :/ so pathname is the /... part
                pathname = parentUrl.slice(parentProtocol.length + (parentUrl[parentProtocol.length] === "/"))
            }

            if (relUrl[0] === "/") return parentUrl.slice(0, parentUrl.length - pathname.length - 1) + relUrl

            // join together and split for removal of .. and . segments
            // looping the string instead of anything fancy for perf reasons
            // '../../../../../z' resolved to 'x/y' is just 'z'
            const segmented = pathname.slice(0, pathname.lastIndexOf("/") + 1) + relUrl

            const output = []
            let segmentIndex = -1
            for (let i = 0; i < segmented.length; i++) {
                // busy reading a segment - only terminate on '/'
                if (segmentIndex !== -1) {
                    if (segmented[i] === "/") {
                        output.push(segmented.slice(segmentIndex, i + 1))
                        segmentIndex = -1
                    }
                }

                // new segment - check if it is relative
                else if (segmented[i] === ".") {
                    // ../ segment
                    if (segmented[i + 1] === "." && (segmented[i + 2] === "/" || i + 2 === segmented.length)) {
                        output.pop()
                        i += 2
                    }
                    // ./ segment
                    else if (segmented[i + 1] === "/" || i + 1 === segmented.length) {
                        i += 1
                    } else {
                        // the start of a new segment as below
                        segmentIndex = i
                    }
                }
                // it is the start of a new segment
                else {
                    segmentIndex = i
                }
            }
            // finish reading out the last segment
            if (segmentIndex !== -1) output.push(segmented.slice(segmentIndex))
            return parentUrl.slice(0, parentUrl.length - pathname.length) + output.join("")
        }
    }

    /*
     * Import maps implementation
     *
     * To make lookups fast we pre-resolve the entire import map
     * and then match based on backtracked hash lookups
     *
     */
    function resolveUrl(relUrl, parentUrl) {
        return (
            resolveIfNotPlainOrUrl(relUrl, parentUrl) ||
            (relUrl.indexOf(":") !== -1 ? relUrl : resolveIfNotPlainOrUrl("./" + relUrl, parentUrl))
        )
    }

    function resolveAndComposePackages(packages, outPackages, baseUrl, parentMap) {
        for (let p in packages) {
            const resolvedLhs = resolveIfNotPlainOrUrl(p, baseUrl) || p
            let target = packages[p]
            if (typeof target !== "string") continue
            const mapped = resolveImportMap(parentMap, resolveIfNotPlainOrUrl(target, baseUrl) || target, baseUrl)
            if (mapped) {
                outPackages[resolvedLhs] = mapped
                continue
            }
            targetWarning(p, packages[p], "bare specifier did not resolve")
        }
    }

    function resolveAndComposeImportMap(json, baseUrl, parentMap) {
        const outMap = { imports: Object.assign({}, parentMap.imports), scopes: Object.assign({}, parentMap.scopes) }

        if (json.imports) resolveAndComposePackages(json.imports, outMap.imports, baseUrl, parentMap)

        if (json.scopes)
            for (let s in json.scopes) {
                const resolvedScope = resolveUrl(s, baseUrl)
                resolveAndComposePackages(
                    json.scopes[s],
                    outMap.scopes[resolvedScope] || (outMap.scopes[resolvedScope] = {}),
                    baseUrl,
                    parentMap
                )
            }

        return outMap
    }

    function getMatch(path, matchObj) {
        if (matchObj[path]) return path
        let sepIndex = path.length
        do {
            const segment = path.slice(0, sepIndex + 1)
            if (segment in matchObj) return segment
        } while ((sepIndex = path.lastIndexOf("/", sepIndex - 1)) !== -1)
    }

    function applyPackages(id, packages) {
        const pkgName = getMatch(id, packages)
        if (pkgName) {
            const pkg = packages[pkgName]
            if (pkg === null) return
            if (id.length > pkgName.length && pkg[pkg.length - 1] !== "/")
                targetWarning(pkgName, pkg, "should have a trailing '/'")
            else return pkg + id.slice(pkgName.length)
        }
    }

    function targetWarning(match, target, msg) {
        console.warn("Package target " + msg + ", resolving target '" + target + "' for " + match)
    }

    function resolveImportMap(importMap, resolvedOrPlain, parentUrl) {
        let scopeUrl = parentUrl && getMatch(parentUrl, importMap.scopes)
        while (scopeUrl) {
            const packageResolution = applyPackages(resolvedOrPlain, importMap.scopes[scopeUrl])
            if (packageResolution) return packageResolution
            scopeUrl = getMatch(scopeUrl.slice(0, scopeUrl.lastIndexOf("/")), importMap.scopes)
        }
        return (
            applyPackages(resolvedOrPlain, importMap.imports) ||
            (resolvedOrPlain.indexOf(":") !== -1 && resolvedOrPlain)
        )
    }

    /* es-module-lexer 0.4.1 */
    const A = 1 === new Uint8Array(new Uint16Array([1]).buffer)[0]
    function parse(g, E = "@") {
        if (!C) return init.then(() => parse(g))
        const I = g.length + 1,
            w = (C.__heap_base.value || C.__heap_base) + 4 * I - C.memory.buffer.byteLength
        w > 0 && C.memory.grow(Math.ceil(w / 65536))
        const D = C.sa(I - 1)
        if (((A ? B : Q)(g, new Uint16Array(C.memory.buffer, D, I)), !C.parse()))
            throw Object.assign(
                new Error(
                    `Parse error ${E}:${g.slice(0, C.e()).split("\n").length}:${C.e() - g.lastIndexOf("\n", C.e() - 1)}`
                ),
                { idx: C.e() }
            )
        const L = [],
            k = []
        for (; C.ri(); ) {
            const A = C.is(),
                Q = C.ie()
            let B
            C.ip() && (B = o(g.slice(A - 1, Q + 1))), L.push({ n: B, s: A, e: Q, ss: C.ss(), se: C.se(), d: C.id() })
        }
        for (; C.re(); ) k.push(g.slice(C.es(), C.ee()))
        function o(A) {
            try {
                return (0, eval)(A)
            } catch {}
        }
        return [L, k, !!C.f()]
    }
    function Q(A, Q) {
        const B = A.length
        let C = 0
        for (; C < B; ) {
            const B = A.charCodeAt(C)
            Q[C++] = ((255 & B) << 8) | (B >>> 8)
        }
    }
    function B(A, Q) {
        const B = A.length
        let C = 0
        for (; C < B; ) Q[C] = A.charCodeAt(C++)
    }
    let C
    const init = WebAssembly.compile(
        ((g =
            "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AuAIIgJBAmoiADYC4AggAkEAKALkCEkNAAsLIAELWAACQAJAIAFBIkYNACABQSdHDQFBACgC4AghARAcIAAgAUECakEAKALgCEEAKAKECBABDwtBACgC4AghARAbIAAgAUECakEAKALgCEEAKAKECBABDwsQHgtoAQJ/QQEhAQJAAkAgAEFfaiICQQVLDQBBASACdEExcQ0BCyAAQfj/A3FBKEYNACAAQUZqQf//A3FBBkkNAAJAIABBpX9qIgJBA0sNACACQQFHDQELIABBhX9qQf//A3FBBEkhAQsgAQttAQJ/AkACQANAAkAgAEH//wNxIgFBd2oiAkEXSw0AQQEgAnRBn4CABHENAgsgAUGgAUYNASAAIQIgARApDQJBACECQQBBACgC4AgiAEECajYC4AggAC8BAiIADQAMAgsLIAAhAgsgAkH//wNxC1wBAn8CQEEAKALgCCICLwEAIgNB4QBHDQBBACACQQRqNgLgCBAnIQJBACgC4AghACACECoaQQAoAuAIIQEQJyEDQQAoAuAIIQILAkAgAiAARg0AIAAgARACCyADC4kBAQV/QQAoAuAIIQBBACgC5AghAQN/IABBAmohAgJAAkAgACABTw0AIAIvAQAiA0Gkf2oiBEEBTQ0BIAIhACADQXZqIgNBA0sNAiACIQAgAw4EAAICAAALQQAgAjYC4AgQHkEADwsCQAJAIAQOAgEAAQtBACACNgLgCEHdAA8LIABBBGohAAwACwtJAQF/QQAhBwJAIAAvAQogBkcNACAALwEIIAVHDQAgAC8BBiAERw0AIAAvAQQgA0cNACAALwECIAJHDQAgAC8BACABRiEHCyAHC1MBAX9BACEIAkAgAC8BDCAHRw0AIAAvAQogBkcNACAALwEIIAVHDQAgAC8BBiAERw0AIAAvAQQgA0cNACAALwECIAJHDQAgAC8BACABRiEICyAICwsfAgBBgAgLAgAAAEGECAsQAQAAAAIAAAAABAAAcDgAAA=="),
        "undefined" != typeof window && "function" == typeof atob
            ? Uint8Array.from(atob(g), (A) => A.charCodeAt(0))
            : Buffer.from(g, "base64"))
    )
        .then(WebAssembly.instantiate)
        .then(({ exports: A }) => {
            C = A
        })
    var g

    let id = 0
    const registry = {}
    {
        self._esmsr = registry
    }

    async function loadAll(load, seen) {
        if (load.b || seen[load.u]) return
        seen[load.u] = 1
        await load.L
        return Promise.all(load.d.map((dep) => loadAll(dep, seen)))
    }

    let waitingForImportMapsInterval
    let firstTopLevelProcess = true
    async function topLevelLoad(url, source, polyfill) {
        // no need to even fetch if we have feature support
        await featureDetectionPromise
        if (waitingForImportMapsInterval > 0) {
            clearTimeout(waitingForImportMapsInterval)
            waitingForImportMapsInterval = 0
        }
        if (firstTopLevelProcess) {
            firstTopLevelProcess = false
            processScripts()
        }
        await importMapPromise
        // early analysis opt-out
        if (polyfill && supportsDynamicImport && supportsImportMeta && supportsImportMaps && !importMapSrcOrLazy) {
            // dont reexec inline for polyfills -> just return null
            return source && polyfill ? null : dynamicImport(source ? createBlob(source) : url)
        }
        await init
        const load = getOrCreateLoad(url, source)
        const seen = {}
        await loadAll(load, seen)
        lastLoad = undefined
        resolveDeps(load, seen)
        // inline "module-shim" must still execute even if no shim
        if (source && !polyfill && !load.n) {
            const module = dynamicImport(createBlob(source))
            if (shouldRevokeBlobURLs) revokeObjectURLs(Object.keys(seen))
            return module
        }
        const module = await dynamicImport(load.b)
        // if the top-level load is a shell, run its update function
        if (load.s) {
            ;(await dynamicImport(load.s)).u$_(module)
        }
        if (shouldRevokeBlobURLs) revokeObjectURLs(Object.keys(seen))
        return module
    }

    function revokeObjectURLs(registryKeys) {
        let batch = 0
        const keysLength = registryKeys.length
        const schedule = self.requestIdleCallback ? self.requestIdleCallback : self.requestAnimationFrame
        schedule(cleanup)
        function cleanup() {
            const batchStartIndex = batch * 100
            if (batchStartIndex > keysLength) return
            for (const key of registryKeys.slice(batchStartIndex, batchStartIndex + 100)) {
                const load = registry[key]
                if (load) URL.revokeObjectURL(load.b)
            }
            batch++
            schedule(cleanup)
        }
    }

    async function importShim(id, parentUrl = baseUrl) {
        await featureDetectionPromise
        // Make sure all the "in-flight" import maps are loaded and applied.
        await importMapPromise
        return topLevelLoad(resolve(id, parentUrl).r || throwUnresolved(id, parentUrl))
    }

    self.importShim = importShim

    const meta = {}

    const edge = navigator.userAgent.match(/Edge\/\d\d\.\d+$/)

    async function importMetaResolve(id, parentUrl = this.url) {
        await importMapPromise
        return resolve(id, `${parentUrl}`).r || throwUnresolved(id, parentUrl)
    }

    self._esmsm = meta

    const esmsInitOptions = self.esmsInitOptions || {}
    delete self.esmsInitOptions
    const shimMode =
        typeof esmsInitOptions.shimMode === "boolean"
            ? esmsInitOptions.shimMode
            : !!esmsInitOptions.fetch ||
              !!document.querySelector('script[type="module-shim"],script[type="importmap-shim"]')
    const fetchHook = esmsInitOptions.fetch || ((url) => fetch(url))
    const skip = esmsInitOptions.skip || /^https?:\/\/(cdn\.skypack\.dev|jspm\.dev)\//
    const onerror =
        esmsInitOptions.onerror ||
        ((e) => {
            throw e
        })
    const shouldRevokeBlobURLs = esmsInitOptions.revokeBlobURLs

    function urlJsString(url) {
        return `'${url.replace(/'/g, "\\'")}'`
    }

    let lastLoad
    function resolveDeps(load, seen) {
        if (load.b || !seen[load.u]) return
        seen[load.u] = 0

        for (const dep of load.d) resolveDeps(dep, seen)

        if (!load.n && !shimMode) {
            load.b = lastLoad = load.u
            load.S = undefined
            return
        }

        const [imports] = load.a

        // "execution"
        const source = load.S

        // edge doesnt execute sibling in order, so we fix this up by ensuring all previous executions are explicit dependencies
        let resolvedSource = edge && lastLoad ? `import '${lastLoad}';` : ""

        if (!imports.length) {
            resolvedSource += source
        } else {
            // once all deps have loaded we can inline the dependency resolution blobs
            // and define this blob
            let lastIndex = 0,
                depIndex = 0
            for (const { s: start, e: end, d: dynamicImportIndex, n } of imports) {
                // dependency source replacements
                if (dynamicImportIndex === -1) {
                    const depLoad = load.d[depIndex++]
                    let blobUrl = depLoad.b
                    if (!blobUrl) {
                        // circular shell creation
                        if (!(blobUrl = depLoad.s)) {
                            blobUrl = depLoad.s = createBlob(
                                `export function u$_(m){${depLoad.a[1]
                                    .map((name) => (name === "default" ? `$_default=m.default` : `${name}=m.${name}`))
                                    .join(",")}}${depLoad.a[1]
                                    .map((name) =>
                                        name === "default"
                                            ? `let $_default;export{$_default as default}`
                                            : `export let ${name}`
                                    )
                                    .join(";")}\n//# sourceURL=${depLoad.r}?cycle`
                            )
                        }
                    }
                    // circular shell execution
                    else if (depLoad.s) {
                        resolvedSource += `${source.slice(lastIndex, start - 1)}/*${source.slice(
                            start - 1,
                            end + 1
                        )}*/${urlJsString(blobUrl)};import*as m$_${depIndex} from'${
                            depLoad.b
                        }';import{u$_ as u$_${depIndex}}from'${depLoad.s}';u$_${depIndex}(m$_${depIndex})`
                        lastIndex = end + 1
                        depLoad.s = undefined
                        continue
                    }
                    resolvedSource += `${source.slice(lastIndex, start - 1)}/*${source.slice(
                        start - 1,
                        end + 1
                    )}*/${urlJsString(blobUrl)}`
                    lastIndex = end + 1
                }
                // import.meta
                else if (dynamicImportIndex === -2) {
                    meta[load.r] = { url: load.r, resolve: importMetaResolve }
                    resolvedSource += `${source.slice(lastIndex, start)}self._esmsm[${urlJsString(load.r)}]`
                    lastIndex = end
                }
                // dynamic import
                else {
                    resolvedSource += `${source.slice(lastIndex, dynamicImportIndex + 6)}Shim(${source.slice(
                        start,
                        end
                    )}, ${load.r && urlJsString(load.r)}`
                    lastIndex = end
                }
            }

            resolvedSource += source.slice(lastIndex)
        }

        resolvedSource = resolvedSource.replace(/\/\/# sourceMappingURL=(.*)\s*$/, (match, url) => {
            return match.replace(url, new URL(url, load.r))
        })
        let hasSourceURL = false
        resolvedSource = resolvedSource.replace(/\/\/# sourceURL=(.*)\s*$/, (match, url) => {
            hasSourceURL = true
            return match.replace(url, new URL(url, load.r))
        })
        if (!hasSourceURL) {
            resolvedSource += "\n//# sourceURL=" + load.r
        }

        load.b = lastLoad = createBlob(resolvedSource)
        load.S = undefined
    }

    function getOrCreateLoad(url, source) {
        let load = registry[url]
        if (load) return load

        load = registry[url] = {
            // url
            u: url,
            // response url
            r: undefined,
            // fetchPromise
            f: undefined,
            // source
            S: undefined,
            // linkPromise
            L: undefined,
            // analysis
            a: undefined,
            // deps
            d: undefined,
            // blobUrl
            b: undefined,
            // shellUrl
            s: undefined,
            // needsShim
            n: false,
        }

        load.f = (async () => {
            if (!source) {
                const res = await fetchHook(url, { credentials: "same-origin" })
                if (!res.ok) throw new Error(`${res.status} ${res.statusText} ${res.url}`)
                load.r = res.url
                const contentType = res.headers.get("content-type")
                if (contentType.match(/^(text|application)\/(x-)?javascript(;|$)/)) source = await res.text()
                else throw new Error(`Unknown Content-Type "${contentType}"`)
            }
            try {
                load.a = parse(source, load.u)
            } catch (e) {
                console.warn(e)
                load.a = [[], []]
            }
            load.S = source
            // determine if this source needs polyfilling
            for (const { e: end, d: dynamicImportIndex } of load.a[0]) {
                if (dynamicImportIndex === -2) {
                    if (!supportsImportMeta || source.slice(end, end + 8) === ".resolve") {
                        load.n = true
                        break
                    }
                } else if (dynamicImportIndex !== -1) {
                    if (!supportsDynamicImport || (!supportsImportMaps && hasImportMap) || importMapSrcOrLazy) {
                        load.n = true
                        break
                    }
                }
            }
        })()

        load.L = load.f.then(async () => {
            load.d = await Promise.all(
                load.a[0]
                    .filter((d) => d.d === -1)
                    .map((d) => d.n)
                    .map(async (depId) => {
                        const { r, m } = resolve(depId, load.r || load.u)
                        if (!r) throwUnresolved(depId, load.r || load.u)
                        if (m && (!supportsImportMaps || importMapSrcOrLazy)) load.n = true
                        if (skip.test(r)) return { b: r }
                        const depLoad = getOrCreateLoad(r)
                        await depLoad.f
                        return depLoad
                    })
            )
            if (!load.n) load.n = load.d.some((dep) => dep.n)
        })

        return load
    }

    let importMap = { imports: {}, scopes: {} }
    let importMapSrcOrLazy = false
    let hasImportMap = false
    let importMapPromise = resolvedPromise

    if (hasDocument) {
        processScripts()
        waitingForImportMapsInterval = setInterval(processScripts, 20)
    }

    async function processScripts() {
        if (waitingForImportMapsInterval > 0 && document.readyState !== "loading") {
            clearTimeout(waitingForImportMapsInterval)
            waitingForImportMapsInterval = 0
        }
        for (const script of document.querySelectorAll(
            'script[type="module-shim"],script[type="importmap-shim"],script[type="module"],script[type="importmap"]'
        ))
            await processScript(script)
    }

    new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type !== "childList") continue
            for (const node of mutation.addedNodes) {
                if (node.tagName === "SCRIPT" && node.type) processScript(node, !firstTopLevelProcess)
            }
        }
    }).observe(document, { childList: true, subtree: true })

    async function processScript(script, dynamic) {
        if (script.ep)
            // ep marker = script processed
            return
        const shim = script.type.endsWith("-shim")
        const type = shim ? script.type.slice(0, -5) : script.type
        if ((!shim && shimMode) || script.getAttribute("noshim") !== null) return
        // empty inline scripts sometimes show before domready
        if (!script.src && !script.innerHTML) return
        script.ep = true
        if (type === "module") {
            await topLevelLoad(script.src || `${baseUrl}?${id++}`, !script.src && script.innerHTML, !shim).catch(
                onerror
            )
        } else if (type === "importmap") {
            importMapPromise = importMapPromise.then(async () => {
                if (script.src || dynamic) importMapSrcOrLazy = true
                hasImportMap = true
                importMap = resolveAndComposeImportMap(
                    script.src ? await (await fetchHook(script.src)).json() : JSON.parse(script.innerHTML),
                    script.src || baseUrl,
                    importMap
                )
            })
        }
    }

    function resolve(id, parentUrl) {
        const urlResolved = resolveIfNotPlainOrUrl(id, parentUrl)
        const resolved = resolveImportMap(importMap, urlResolved || id, parentUrl)
        return { r: resolved, m: urlResolved !== resolved }
    }

    function throwUnresolved(id, parentUrl) {
        throw Error("Unable to resolve specifier '" + id + (parentUrl ? "' from " + parentUrl : "'"))
    }
})()
