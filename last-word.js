var lengthOfLastWord = function(s) {
    const array = s.split(' ').filter(Boolean)
    console.log(array)
    const lastOne = array[array.length - 1]
    return lastOne.length
};


lengthOfLastWord('   fly me   to   the moon  ')