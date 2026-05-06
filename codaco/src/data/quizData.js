const levels = [
  { id: 'easy', nome: 'Facil', desc: 'Operacoes basicas: adicao e subtracao' },
  { id: 'medium', nome: 'Medio', desc: 'Multiplicacao e divisao' },
  { id: 'hard', nome: 'Dificil', desc: 'Expressoes mais complexas' }
];

const questionsByLevel = {
  easy: [
    { id: 'q1_easy', question: 'Quanto e 5 + 3?', code: 'print(5 + 3)', options: ['7', '8', '9', '10'], answer: 1, explanation: '5 + 3 = 8' },
    { id: 'q2_easy', question: 'Quanto e 12 - 4?', code: 'print(12 - 4)', options: ['6', '7', '8', '9'], answer: 2, explanation: '12 - 4 = 8' },
    { id: 'q3_easy', question: 'Quanto e 7 + 2?', code: 'print(7 + 2)', options: ['8', '9', '10', '11'], answer: 1, explanation: '7 + 2 = 9' },
    { id: 'q4_easy', question: 'Quanto e 15 - 6?', code: 'print(15 - 6)', options: ['8', '9', '10', '11'], answer: 1, explanation: '15 - 6 = 9' },
    { id: 'q5_easy', question: 'Quanto e 10 + 5?', code: 'print(10 + 5)', options: ['14', '15', '16', '17'], answer: 1, explanation: '10 + 5 = 15' },
    { id: 'q6_easy', question: 'Quanto e 20 - 8?', code: 'print(20 - 8)', options: ['10', '11', '12', '13'], answer: 2, explanation: '20 - 8 = 12' },
    { id: 'q7_easy', question: 'Quanto e 3 + 4 + 2?', code: 'print(3 + 4 + 2)', options: ['8', '9', '10', '11'], answer: 1, explanation: '3 + 4 + 2 = 9' },
    { id: 'q8_easy', question: 'Quanto e 25 - 10?', code: 'print(25 - 10)', options: ['13', '14', '15', '16'], answer: 2, explanation: '25 - 10 = 15' },
    { id: 'q9_easy', question: 'Quanto e 6 + 6?', code: 'print(6 + 6)', options: ['10', '11', '12', '13'], answer: 2, explanation: '6 + 6 = 12' },
    { id: 'q10_easy', question: 'Quanto e 18 - 9?', code: 'print(18 - 9)', options: ['8', '9', '10', '11'], answer: 1, explanation: '18 - 9 = 9' }
  ],
  medium: [
    { id: 'q1_medium', question: 'Quanto e 5 x 4?', code: 'print(5 * 4)', options: ['18', '19', '20', '21'], answer: 2, explanation: '5 * 4 = 20' },
    { id: 'q2_medium', question: 'Quanto e 24 / 4?', code: 'print(24 / 4)', options: ['5', '6', '7', '8'], answer: 1, explanation: '24 / 4 = 6' },
    { id: 'q3_medium', question: 'Quanto e 7 x 3?', code: 'print(7 * 3)', options: ['19', '20', '21', '22'], answer: 2, explanation: '7 * 3 = 21' },
    { id: 'q4_medium', question: 'Quanto e 36 / 6?', code: 'print(36 / 6)', options: ['5', '6', '7', '8'], answer: 1, explanation: '36 / 6 = 6' },
    { id: 'q5_medium', question: 'Quanto e 8 x 5?', code: 'print(8 * 5)', options: ['38', '39', '40', '41'], answer: 2, explanation: '8 * 5 = 40' },
    { id: 'q6_medium', question: 'Quanto e 50 / 5?', code: 'print(50 / 5)', options: ['8', '9', '10', '11'], answer: 2, explanation: '50 / 5 = 10' },
    { id: 'q7_medium', question: 'Quanto e 9 x 6?', code: 'print(9 * 6)', options: ['52', '53', '54', '55'], answer: 2, explanation: '9 * 6 = 54' },
    { id: 'q8_medium', question: 'Quanto e 63 / 9?', code: 'print(63 / 9)', options: ['6', '7', '8', '9'], answer: 1, explanation: '63 / 9 = 7' },
    { id: 'q9_medium', question: 'Quanto e 12 x 3?', code: 'print(12 * 3)', options: ['34', '35', '36', '37'], answer: 2, explanation: '12 * 3 = 36' },
    { id: 'q10_medium', question: 'Quanto e 100 / 10?', code: 'print(100 / 10)', options: ['8', '9', '10', '11'], answer: 2, explanation: '100 / 10 = 10' }
  ],
  hard: [
    { id: 'q1_hard', question: 'Quanto e (5 + 3) x 2?', code: 'print((5 + 3) * 2)', options: ['14', '15', '16', '17'], answer: 2, explanation: '(5 + 3) * 2 = 16' },
    { id: 'q2_hard', question: 'Quanto e 10 + 5 x 2?', code: 'print(10 + 5 * 2)', options: ['20', '25', '30', '35'], answer: 0, explanation: 'Multiplicacao primeiro: 10 + (5 * 2) = 20' },
    { id: 'q3_hard', question: 'Quanto e (20 - 4) / 2?', code: 'print((20 - 4) / 2)', options: ['6', '7', '8', '9'], answer: 2, explanation: '(20 - 4) / 2 = 8' },
    { id: 'q4_hard', question: 'Quanto e 3 x (4 + 2)?', code: 'print(3 * (4 + 2))', options: ['16', '17', '18', '19'], answer: 2, explanation: '3 * (4 + 2) = 18' },
    { id: 'q5_hard', question: 'Quanto e 25 + 25 - 10?', code: 'print(25 + 25 - 10)', options: ['38', '39', '40', '41'], answer: 2, explanation: '25 + 25 - 10 = 40' },
    { id: 'q6_hard', question: 'Quanto e (30 / 5) x 4?', code: 'print((30 / 5) * 4)', options: ['22', '23', '24', '25'], answer: 2, explanation: '(30 / 5) * 4 = 24' },
    { id: 'q7_hard', question: 'Quanto e 50 - 20 + 15?', code: 'print(50 - 20 + 15)', options: ['42', '43', '44', '45'], answer: 3, explanation: '50 - 20 + 15 = 45' },
    { id: 'q8_hard', question: 'Quanto e (100 / 10) x 3?', code: 'print((100 / 10) * 3)', options: ['28', '29', '30', '31'], answer: 2, explanation: '(100 / 10) * 3 = 30' },
    { id: 'q9_hard', question: 'Quanto e 7 x 8 - 10?', code: 'print(7 * 8 - 10)', options: ['45', '46', '47', '48'], answer: 1, explanation: '7 * 8 - 10 = 46' },
    { id: 'q10_hard', question: 'Quanto e (15 + 5) x 2 - 10?', code: 'print((15 + 5) * 2 - 10)', options: ['28', '29', '30', '31'], answer: 2, explanation: '(15 + 5) * 2 - 10 = 30' }
  ]
};

function getLevels() {
  return levels;
}

function getQuestionsByLevel(level = 'easy') {
  return questionsByLevel[level] ?? questionsByLevel.easy;
}

module.exports = {
  getLevels,
  getQuestionsByLevel
};
