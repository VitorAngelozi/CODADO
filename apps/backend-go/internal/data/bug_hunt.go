package data

import "codado/backendgo/internal/domain"

func BugHuntChallenges() []domain.BugHuntChallenge {
	challenges := []domain.BugHuntChallenge{
		{
			ID:            "bug_normal_01",
			Title:         "Loop infinito na validacao",
			Prompt:        "Corrija o codigo para retornar apenas numeros pares de 0 ate n.",
			BuggyCode:     "def pares_ate(n):\n    nums = []\n    i = 0\n    while i <= n:\n        if i % 2 == 0:\n            nums.append(i)\n    return nums",
			EntryFunction: "pares_ate",
		},
		{
			ID:            "bug_normal_02",
			Title:         "Condicao invertida",
			Prompt:        "A funcao deve retornar o maior entre a e b.",
			BuggyCode:     "def maior(a, b):\n    if a < b:\n        return a\n    return b",
			EntryFunction: "maior",
		},
		{
			ID:            "bug_normal_03",
			Title:         "Off-by-one em indexacao",
			Prompt:        "A funcao deve retornar o ultimo caractere da string.",
			BuggyCode:     "def ultimo_char(s):\n    return s[len(s)]",
			EntryFunction: "ultimo_char",
		},
		{
			ID:            "bug_hard_01",
			Title:         "Default mutavel vazando estado",
			Prompt:        "A funcao deve agrupar itens por categoria sem compartilhar estado entre chamadas.",
			BuggyCode:     "def agrupar_item(categoria, item, buckets={}):\n    buckets.setdefault(categoria, []).append(item)\n    return buckets",
			EntryFunction: "agrupar_item",
		},
		{
			ID:            "bug_hard_02",
			Title:         "Ordenacao numerica quebrada",
			Prompt:        "A funcao deve ordenar numeros em ordem crescente, mesmo quando vierem como texto.",
			BuggyCode:     "def ordenar_pontuacoes(valores):\n    return sorted(valores)",
			EntryFunction: "ordenar_pontuacoes",
		},
		{
			ID:            "bug_hard_03",
			Title:         "Chave ausente em dicionario",
			Prompt:        "Some os pontos dos jogadores ignorando quem nao tiver a chave \"score\".",
			BuggyCode:     "def somar_scores(jogadores):\n    total = 0\n    for jogador in jogadores:\n        total += jogador[\"score\"]\n    return total",
			EntryFunction: "somar_scores",
		},
		{
			ID:            "bug_hard_04",
			Title:         "Media com divisao por zero",
			Prompt:        "Retorne a media da lista. Se vier vazia, devolva 0.",
			BuggyCode:     "def media(valores):\n    return sum(valores) / len(valores)",
			EntryFunction: "media",
		},
		{
			ID:            "bug_hard_05",
			Title:         "Normalizacao parcial de texto",
			Prompt:        "A funcao deve contar quantas vezes uma letra aparece, ignorando maiusculas e minusculas.",
			BuggyCode:     "def contar_letra(texto, alvo):\n    total = 0\n    for ch in texto:\n        if ch == alvo.lower():\n            total += 1\n    return total",
			EntryFunction: "contar_letra",
		},
	}

	challenges[0].TestCases = []struct {
		Input    []any `json:"input"`
		Expected any   `json:"expected"`
	}{
		{Input: []any{0}, Expected: []any{0}},
		{Input: []any{5}, Expected: []any{0, 2, 4}},
		{Input: []any{8}, Expected: []any{0, 2, 4, 6, 8}},
	}
	challenges[1].TestCases = []struct {
		Input    []any `json:"input"`
		Expected any   `json:"expected"`
	}{
		{Input: []any{10, 3}, Expected: 10},
		{Input: []any{2, 9}, Expected: 9},
		{Input: []any{7, 7}, Expected: 7},
	}
	challenges[2].TestCases = []struct {
		Input    []any `json:"input"`
		Expected any   `json:"expected"`
	}{
		{Input: []any{"codado"}, Expected: "o"},
		{Input: []any{"python"}, Expected: "n"},
		{Input: []any{"a"}, Expected: "a"},
	}
	challenges[3].TestCases = []struct {
		Input    []any `json:"input"`
		Expected any   `json:"expected"`
	}{
		{Input: []any{"backend", "api"}, Expected: map[string]any{"backend": []any{"api"}}},
		{Input: []any{"frontend", "ui"}, Expected: map[string]any{"frontend": []any{"ui"}}},
		{Input: []any{"backend", "cache", map[string]any{"backend": []any{"api"}}}, Expected: map[string]any{"backend": []any{"api", "cache"}}},
	}
	challenges[4].TestCases = []struct {
		Input    []any `json:"input"`
		Expected any   `json:"expected"`
	}{
		{Input: []any{[]any{10, 2, 30, 4}}, Expected: []any{2, 4, 10, 30}},
		{Input: []any{[]any{"10", "2", "30", "4"}}, Expected: []any{2, 4, 10, 30}},
		{Input: []any{[]any{7, "1", 5}}, Expected: []any{1, 5, 7}},
	}
	challenges[5].TestCases = []struct {
		Input    []any `json:"input"`
		Expected any   `json:"expected"`
	}{
		{Input: []any{[]any{map[string]any{"name": "ana", "score": 5}, map[string]any{"name": "bia", "score": 7}}}, Expected: 12},
		{Input: []any{[]any{map[string]any{"name": "ana"}, map[string]any{"name": "bia", "score": 3}, map[string]any{"name": "caio"}}}, Expected: 3},
		{Input: []any{[]any{}}, Expected: 0},
	}
	challenges[6].TestCases = []struct {
		Input    []any `json:"input"`
		Expected any   `json:"expected"`
	}{
		{Input: []any{[]any{10, 20, 30}}, Expected: 20},
		{Input: []any{[]any{5}}, Expected: 5},
		{Input: []any{[]any{}}, Expected: 0},
	}
	challenges[7].TestCases = []struct {
		Input    []any `json:"input"`
		Expected any   `json:"expected"`
	}{
		{Input: []any{"BanAna", "a"}, Expected: 3},
		{Input: []any{"PYthon Py", "p"}, Expected: 2},
		{Input: []any{"debug", "Z"}, Expected: 0},
	}

	return challenges
}
