/**
 * @param {number[]} prices
 * @return {number}
 */
const maxProfit = function (prices) {
    let start = prices[0]
    let end = -1

    for (let i = 1; i < prices.length; i++) {
        console.log({start, end})
        if(prices[i] <= start) {
            start = prices[i]
        } else if(prices[i] > end) {
            end = prices[i]
        }
        console.log({start, end})
    }
    return end > start ? end - start : 0
};

maxProfit([2,4,1])