package data

import "codado/backendgo/internal/domain"

func Levels() []domain.Level {
	return []domain.Level{
		{ID: domain.LevelEasy, Nome: "Facil", Desc: "Operacoes basicas: adicao e subtracao"},
		{ID: domain.LevelMedium, Nome: "Medio", Desc: "Multiplicacao e divisao"},
		{ID: domain.LevelHard, Nome: "Dificil", Desc: "Expressoes mais complexas"},
	}
}

func QuestionsByLevel() map[domain.ApiQuizLevelID][]domain.Question {
	return map[domain.ApiQuizLevelID][]domain.Question{
		domain.LevelEasy: {
			{ID: "q1_easy", Question: "Quanto e 5 + 3?", Code: "print(5 + 3)", Options: []string{"7", "8", "9", "10"}, Answer: 1, Explanation: "5 + 3 = 8"},
			{ID: "q2_easy", Question: "Quanto e 12 - 4?", Code: "print(12 - 4)", Options: []string{"6", "7", "8", "9"}, Answer: 2, Explanation: "12 - 4 = 8"},
			{ID: "q3_easy", Question: "Quanto e 7 + 2?", Code: "print(7 + 2)", Options: []string{"8", "9", "10", "11"}, Answer: 1, Explanation: "7 + 2 = 9"},
			{ID: "q4_easy", Question: "Quanto e 15 - 6?", Code: "print(15 - 6)", Options: []string{"8", "9", "10", "11"}, Answer: 1, Explanation: "15 - 6 = 9"},
			{ID: "q5_easy", Question: "Quanto e 10 + 5?", Code: "print(10 + 5)", Options: []string{"14", "15", "16", "17"}, Answer: 1, Explanation: "10 + 5 = 15"},
			{ID: "q6_easy", Question: "Quanto e 20 - 8?", Code: "print(20 - 8)", Options: []string{"10", "11", "12", "13"}, Answer: 2, Explanation: "20 - 8 = 12"},
			{ID: "q7_easy", Question: "Quanto e 3 + 4 + 2?", Code: "print(3 + 4 + 2)", Options: []string{"8", "9", "10", "11"}, Answer: 1, Explanation: "3 + 4 + 2 = 9"},
			{ID: "q8_easy", Question: "Quanto e 25 - 10?", Code: "print(25 - 10)", Options: []string{"13", "14", "15", "16"}, Answer: 2, Explanation: "25 - 10 = 15"},
			{ID: "q9_easy", Question: "Quanto e 6 + 6?", Code: "print(6 + 6)", Options: []string{"10", "11", "12", "13"}, Answer: 2, Explanation: "6 + 6 = 12"},
			{ID: "q10_easy", Question: "Quanto e 18 - 9?", Code: "print(18 - 9)", Options: []string{"8", "9", "10", "11"}, Answer: 1, Explanation: "18 - 9 = 9"},
		},
		domain.LevelMedium: {
			{ID: "q1_medium", Question: "Quanto e 5 x 4?", Code: "print(5 * 4)", Options: []string{"18", "19", "20", "21"}, Answer: 2, Explanation: "5 * 4 = 20"},
			{ID: "q2_medium", Question: "Quanto e 24 / 4?", Code: "print(24 / 4)", Options: []string{"5", "6", "7", "8"}, Answer: 1, Explanation: "24 / 4 = 6"},
			{ID: "q3_medium", Question: "Quanto e 7 x 3?", Code: "print(7 * 3)", Options: []string{"19", "20", "21", "22"}, Answer: 2, Explanation: "7 * 3 = 21"},
			{ID: "q4_medium", Question: "Quanto e 36 / 6?", Code: "print(36 / 6)", Options: []string{"5", "6", "7", "8"}, Answer: 1, Explanation: "36 / 6 = 6"},
			{ID: "q5_medium", Question: "Quanto e 8 x 5?", Code: "print(8 * 5)", Options: []string{"38", "39", "40", "41"}, Answer: 2, Explanation: "8 * 5 = 40"},
			{ID: "q6_medium", Question: "Quanto e 50 / 5?", Code: "print(50 / 5)", Options: []string{"8", "9", "10", "11"}, Answer: 2, Explanation: "50 / 5 = 10"},
			{ID: "q7_medium", Question: "Quanto e 9 x 6?", Code: "print(9 * 6)", Options: []string{"52", "53", "54", "55"}, Answer: 2, Explanation: "9 * 6 = 54"},
			{ID: "q8_medium", Question: "Quanto e 63 / 9?", Code: "print(63 / 9)", Options: []string{"6", "7", "8", "9"}, Answer: 1, Explanation: "63 / 9 = 7"},
			{ID: "q9_medium", Question: "Quanto e 12 x 3?", Code: "print(12 * 3)", Options: []string{"34", "35", "36", "37"}, Answer: 2, Explanation: "12 * 3 = 36"},
			{ID: "q10_medium", Question: "Quanto e 100 / 10?", Code: "print(100 / 10)", Options: []string{"8", "9", "10", "11"}, Answer: 2, Explanation: "100 / 10 = 10"},
		},
		domain.LevelHard: {
			{ID: "q1_hard", Question: "Quanto e (5 + 3) x 2?", Code: "print((5 + 3) * 2)", Options: []string{"14", "15", "16", "17"}, Answer: 2, Explanation: "(5 + 3) * 2 = 16"},
			{ID: "q2_hard", Question: "Quanto e 10 + 5 x 2?", Code: "print(10 + 5 * 2)", Options: []string{"20", "25", "30", "35"}, Answer: 0, Explanation: "Multiplicacao primeiro: 10 + (5 * 2) = 20"},
			{ID: "q3_hard", Question: "Quanto e (20 - 4) / 2?", Code: "print((20 - 4) / 2)", Options: []string{"6", "7", "8", "9"}, Answer: 2, Explanation: "(20 - 4) / 2 = 8"},
			{ID: "q4_hard", Question: "Quanto e 3 x (4 + 2)?", Code: "print(3 * (4 + 2))", Options: []string{"16", "17", "18", "19"}, Answer: 2, Explanation: "3 * (4 + 2) = 18"},
			{ID: "q5_hard", Question: "Quanto e 25 + 25 - 10?", Code: "print(25 + 25 - 10)", Options: []string{"38", "39", "40", "41"}, Answer: 2, Explanation: "25 + 25 - 10 = 40"},
			{ID: "q6_hard", Question: "Quanto e (30 / 5) x 4?", Code: "print((30 / 5) * 4)", Options: []string{"22", "23", "24", "25"}, Answer: 2, Explanation: "(30 / 5) * 4 = 24"},
			{ID: "q7_hard", Question: "Quanto e 50 - 20 + 15?", Code: "print(50 - 20 + 15)", Options: []string{"42", "43", "44", "45"}, Answer: 3, Explanation: "50 - 20 + 15 = 45"},
			{ID: "q8_hard", Question: "Quanto e (100 / 10) x 3?", Code: "print((100 / 10) * 3)", Options: []string{"28", "29", "30", "31"}, Answer: 2, Explanation: "(100 / 10) * 3 = 30"},
			{ID: "q9_hard", Question: "Quanto e 7 x 8 - 10?", Code: "print(7 * 8 - 10)", Options: []string{"45", "46", "47", "48"}, Answer: 1, Explanation: "7 * 8 - 10 = 46"},
			{ID: "q10_hard", Question: "Quanto e (15 + 5) x 2 - 10?", Code: "print((15 + 5) * 2 - 10)", Options: []string{"28", "29", "30", "31"}, Answer: 2, Explanation: "(15 + 5) * 2 - 10 = 30"},
		},
	}
}
