helpers.createRandomString = function createARandomString(strLength) {
    strLength = typeof (strLength) === 'number'
        && strLength > 0
        ? strLength
        : false;

    if (strLength) {
        // Make an array with the length of the string
        return [...Array(strLength)]
            // Assign a random character to each index in the array
            .map(() => Math.random()
                .toString(36)
                .substring(2, 3))
            // Join the array to a string
            .join('');
    }

    return false;
};
