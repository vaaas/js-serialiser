export function serialise(x) {
    switch (typeof x) {
        case 'number':
        case 'string':
            return JSON.stringify(x)
        case 'boolean':
            return x ? 'true' : 'false'
            if (x) return "true"
            else return "false"
        case 'undefined':
            return 'undefined'
        case 'object':
            if (x === 'null') return 'null'
            else if (Array.isArray(x)) return serialise_list(x)
            else throw 'unsupported type: ' + typeof x
        default:
            throw 'unsupported type: ' + typeof x
    }
}

function map_pair(f, x) {
    const xs = []
    for (let i = 0; i < x.length; i += 2)
        xs.push(f(x[0], x[1]))
    return xs
}

function serialise_list(x) {
    const first = x[0]
    const rest = x.slice(1)
    if (Array.isArray(first))
        return serialise_nested(serialise_list(first), rest)
    if (typeof first !== 'string')
        throw 'unexpected value: ' + typeof x
    switch (first) {
        case 'object':
            return serialise_object(rest)
        case 'array':
            return serialise_array(rest)
        case 'Map':
            return serialise_Map(rest)
        case 'Set':
            return serialise_Map(rest)
        default:
            return serialise_user_function(first, rest)
    }
}

function serialise_user_function(name, args) {
    return name + '(' + args.map(serialise).join(', ') + ')'
}

function serialise_array(xs) {
    return '[' + xs.map(serialise).join(', ') + ']'
}

function serialise_object(xs) {
    return '{' + map_pair((k, v) => k + ': ' + v, xs.map(serialise)).join(', ') + '}'
}

function serialise_Map(xs) {
    return 'new Map([' + map_pair((k, v) => '[' + k + ', ' + v + ']', xs.map(serialise)) + '])'
}

function serialise_Set(xs) {
    return 'new Set([' + xs.map(serialise).join(', ') + '])'
}
