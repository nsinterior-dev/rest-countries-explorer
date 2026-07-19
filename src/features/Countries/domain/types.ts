interface Currency {
    code: string,
    name: string,
    symbol: string
}

interface Flag {
    url: string,
    description: string
}

type DrivingSide = 'left' | 'right'

interface Country {
    name: string,
    officialName: string,
    flag: Flag,
    currencies: Array<Currency>,
    drivesOn: DrivingSide
}

export { type Country, type Currency, type DrivingSide, type Flag}