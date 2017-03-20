new vUnit({
    CSSMap: {
        '.vh': {
            property: 'height',
            reference: 'vh'
        },
        '.vw': {
            property: 'width',
            reference: 'vw'
        },
        '.vwfs': {
            property: 'font-size',
            reference: 'vw'
        },
        '.vhmt': {
            property: 'margin-top',
            reference: 'vh'
        },
        '.vhmb': {
            property: 'margin-bottom',
            reference: 'vh'
        },
        '.vminw': {
            property: 'width',
            reference: 'vmin'
        },
        '.vmaxw': {
            property: 'width',
            reference: 'vmax'
        }
    }
}).init();