const { calcStudantAverage, calcAR, calcPD } = require('../teste');

test('calcula média aritmética corretamente', () => {
    expect(calcStudantAverage('ar', 10, 5)).toBe(7.5);
});

test('calcula média ponderada corretamente', () => {
    expect(calcStudantAverage('pd', 10, 5, 2, 3)).toBe(7);
});

test('calcula a função calcAR corretamente', () => {
    expect(calcAR(10, 5)).toBe(7.5);
});

test('calcula a função calcPD corretamente', () => {
    expect(calcPD(10, 5, 2, 3)).toBe(7);
});
