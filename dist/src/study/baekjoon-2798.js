"use strict";
const run = async () => {
    const fs = require("fs");
    let [conditions, cards] = fs
        .readFileSync("input", "utf-8")
        .trim()
        .split("\n");
    conditions = conditions.split(" ").map(Number);
    cards = cards.split(" ").map(Number);
    const target = conditions[1];
    let current;
    cards.sort((a, b) => a - b);
    for (let i = 0; i < cards.length - 2; i++) {
        let left = i + 1;
        let right = cards.length - 1;
        while (left !== right) {
            const sum = cards[i] + cards[left] + cards[right];
            if (sum > target) {
                right--;
            }
            else {
                left++;
            }
            if (!current || (target >= sum && current < sum)) {
                current = sum;
            }
        }
    }
    console.log(current);
};
//# sourceMappingURL=baekjoon-2798.js.map