import { serialise } from './index.js'

console.log(
    serialise(
        ['Map',
            '18239', ['object',
                'sizes', ['array', ['str', 'sm'], ['str', 'md']],
                'color', ['str', 'blue']],

            '914', ['object',
                'sizes', ['array', ['str', 'md'], ['str', 'lg']],
                'color', ['str', 'red']]
        ]
    )
)
