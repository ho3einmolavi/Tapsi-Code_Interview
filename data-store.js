
class DB {
    constructor() {
        this.store = {}
    }

    set(key, value, time) {
        if (!this.store[key]) {
            this.store[key] = {
                values: {},
                times: []
            }
        }

        this.store[key].values[time] = value

        this.store[key].times.push(time)
    }


    get(key, time) {
        const data = this.store[key]
        if (!data) {
            return null
        }

        const returnedTime = this.search(data.times, time)
        if(!returnedTime) return null
        return data.values[returnedTime]
    }


    search(array, target) {
        if (target < array[0]) {
            return null
        }

        while (array.length > 1) {
            let middleIndex = Math.floor(array.length / 2)
            if (array[middleIndex] < target) {
                array = array.splice(middleIndex, array.length - 1)
            } else if (array[middleIndex] > target) {
                array = array.splice(0, middleIndex)
            } else {
                return array[middleIndex]
            }
        }

        if (array.length === 1) {
            return array[0]
        }
    }

}


const db = new DB()

db.set('key1', 'value1', 1)
db.set('key1', 'value2', 2)
db.set('key1', 'value3', 3)
db.set('key1', 'value4', 4)
db.set('key1', 'value5', 5)
db.set('key1', 'value6', 6)
db.set('key1', 'value12', 12)

const data = db.get('key1', 0)

console.log({data})