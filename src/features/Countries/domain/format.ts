import { Currency, DrivingSide } from './types'
function formatCurrency(currencies: Currency[]){
    if(currencies.length === 0) return "Not specified"
    return currencies.map(({name, symbol}) => {
        return name + " " + `(${symbol})`
    }).join(', ')
}

function formatDriveDirection(side: DrivingSide | null){
    return side || "Not Specified"
}

export {
    formatCurrency,
    formatDriveDirection
}