export function checkPositions(array) {
    const posArray = array.map(row => {
        return row.map(col => {
            return `${col.x}, ${col.y}`
        })
    })
    console.table(posArray)
}
