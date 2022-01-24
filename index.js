export function serialise(x, depth=0) {
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
            else if (Array.isArray(x)) return serialise_list(x, depth)
            else throw 'unsupported type: ' + typeof x
        default:
            throw 'unsupported type: ' + typeof x
    }
}

function make_string(c, n=1) {
    let s = ''
    for (let i = 0; i<n; i++) s += c
    return s
}

function map_pair(f, x) {
    const xs = []
    for (let i = 0; i < x.length; i += 2)
        xs.push(f(x[i], x[i+1]))
    return xs
}

function serialise_list(x, depth) {
    const first = x[0]
    const rest = x.slice(1)
    if (Array.isArray(first))
        return serialise_nested(serialise_list(first), rest, depth)
    if (typeof first !== 'string')
        throw 'unexpected value: ' + typeof x
    switch (first) {
        case 'object':
            return serialise_object(rest, depth)
        case 'array':
            return serialise_array(rest, depth)
        case 'Map':
            return serialise_Map(rest, depth)
        case 'Set':
            return serialise_Sap(rest, depth)
        case 'str':
            return serialise_string(rest, depth)
        case '=':
            return serialise_set(rest, depth)
        case '==':
            return serialise_eq(rest, depth)
        case '!=':
            return serialise_neq(rest, depth)
        case '===':
            return serialise_is(rest, depth)
        case '!==':
            return serialise_isnt(rest, depth)
        case '>':
            return serialise_gt(rest, depth)
        case '>=':
            return serialise_gte(rest, depth)
        case '<':
            return serialise_lt(rest, depth)
        case '<=':
            return serialise_lte(rest, depth)
        case '&&':
            return serialise_and(rest, depth)
        case '||':
            return serialise_or(rest, depth)
        case '??':
            return serialise_null(rest, depth)
        case '?':
            return serialise_ternary(rest, depth)
        case '=>':
            return serialise_arrow(rest, depth)
        default:
            return serialise_user_function(first, rest, depth)
    }
}

function serialise_user_function(name, args, depth) {
    return name + '(' + args.map(x => serialise(x, depth)).join(', ') + ')'
}

function serialise_array(xs, depth) {
    return '[\n' +
        xs.map(x => make_string('\t', depth+1) + serialise(x, depth+1)).join(',\n') +
        '\n' + make_string('\t', depth) + ']'
}

function serialise_object(xs, depth) {
    return '{\n' +
        map_pair((k, v) => make_string('\t', depth+1) + k + ': ' + v, xs.map(x => serialise(x, depth+1))).join(',\n') +
    '\n' + make_string('\t', depth) + '}'
}

function serialise_Map(xs, depth) {
    return 'new Map([\n' +
        map_pair(
            (k, v) => make_string('\t', depth+1) + '[' + k + ', ' + v + ']',
            xs.map(x => serialise(x, depth+1))
        ).join(',\n') +
        '\n' + make_string('\t', depth) + '])'
}

function serialise_infix(s, xs, depth) {
    return xs.map(x => serialise(x, depth)).join(' ' + s + ' ')
}

function serialise_Set(xs, depth) {
    return 'new Set([\n' +
        xs.map(x => make_string('\t', depth+1) + serialise(x, depth+1)).join(', ') +
        '\n])'
}

function serialise_set(xs, depth) {
    return serialise_infix('=', xs, depth)
}

function serialise_eq(xs, depth) {
    return serialise_infix('==', xs, depth)
}

function serialise_neq(xs, depth) {
    return serialise_infix('!=', xs, depth)
}

function serialise_is(xs, depth) {
    return serialise_infix('===', xs, depth)
}

function serialise_isnt(xs, depth) {
    return serialise_infix('!==', xs, depth)
}

function serialise_gt(xs, depth) {
    return serialise_infix('>', xs, depth)
}

function serialise_gte(xs, depth) {
    return serialise_infix('>=', xs, depth)
}

function serialise_lt(xs, depth) {
    return serialise_infix('<', xs, depth)
}

function serialise_lte(xs, depth) {
    return serialise_infix('<=', xs, depth)
}

function serialise_and(xs, depth) {
    return serialise_infix('&&', xs, depth)
}

function serialise_or(xs, depth) {
    return serialise_infix('||', xs, depth)
}

function serialise_null(xs, depth) {
    return serialise_infix('??', xs, depth)
}

function serialise_ternary(xs, depth) {
    return serialise(xs[0]) + '?' + serialise(xs[1]) + ':' + serialise(xs[2])
}

function serialise_string(xs, depth) {
    return '"' + xs.join(' ').replaceAll('\\', '\\\\').replaceAll('"', '\\"') + '"'
}

function serialise_arrow(xs, depth) {
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
        str += '{ ' + body.map(x => serialise(x, depth)).join('\n') + ' }'
    return str
}
