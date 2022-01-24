export function serialise(x) {
    switch (typeof x) {
        case 'number':
            return x.toString()
        case 'string':
            return x
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
        case 'str':
            return serialise_string(rest)
        case '=':
            return serialise_set(rest)
        case '==':
            return serialise_eq(rest)
        case '!=':
            return serialise_neq(rest)
        case '===':
            return serialise_is(rest)
        case '!==':
            return serialise_isnt(rest)
        case '>':
            return serialise_gt(rest)
        case '>=':
            return serialise_gte(rest)
        case '<':
            return serialise_lt(rest)
        case '<=':
            return serialise_lte(rest)
        case '&&':
            return serialise_and(rest)
        case '||':
            return serialise_or(rest)
        case '??':
            return serialise_null(rest)
        case '?':
            return serialise_ternary(rest)
        case '=>':
            return serialise_arrow(rest)
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

function serialise_infix(s, xs) {
    return xs.map(serialise).join(' ' + s + ' ')
}

function serialise_Set(xs) {
    return 'new Set([' + xs.map(serialise).join(', ') + '])'
}

function serialise_set(xs) {
    return serialise_infix('=', xs)
}

function serialise_eq(xs) {
    return serialise_infix('==', xs)
}

function serialise_neq(xs) {
    return serialise_infix('!=', xs)
}

function serialise_is(xs) {
    return serialise_infix('===', xs)
}

function serialise_isnt(xs) {
    return serialise_infix('!==', xs)
}

function serialise_gt(xs) {
    return serialise_infix('>', xs)
}

function serialise_gte(xs) {
    return serialise_infix('>=', xs)
}

function serialise_lt(xs) {
    return serialise_infix('<', xs)
}

function serialise_lte(xs) {
    return serialise_infix('<=', xs)
}

function serialise_and(xs) {
    return serialise_infix('&&', xs)
}

function serialise_or(xs) {
    return serialise_infix('||', xs)
}

function serialise_null(xs) {
    return serialise_infix('??', xs)
}

function serialise_ternary(xs) {
    return serialise(xs[0]) + '?' + serialise(xs[1]) + ':' + serialise(xs[2])
}

function serialise_string(xs) {
    return '"' + xs.join(' ').replaceAll('\\', '\\\\').replaceAll('"', '\\"') + '"'
}

function serialise_arrow(xs) {
    const args = xs[0]
    const body = xs.slice(1)
    let str = ''
    if (args.length === 1)
        str += serialise(args)
    else
        str += '(' + args.join(', ') + ')'
    str += ' => '
    if (body.length === 1)
        str += serialise(body[0])
    else
        str += '{ ' + body.map(serialise).join('\n') + ' }'
    return str
}
