// ============================================================
// EXEMPLO DE COMO EXPANDIR PARA POSTGRESQL
// Este arquivo mostra como estruturar o código para usar DB
// ============================================================

// Arquivo: database/db.go
// (Este arquivo NÃO está implementado ainda, é apenas um exemplo)

package database

import (
	"database/sql"
	"fmt"
	"qiabaco/models"

	_ "github.com/lib/pq"
)

// DB é uma variável global para armazenar a conexão
var DB *sql.DB

// InitDB inicializa a conexão com PostgreSQL
func InitDB(dsn string) error {
	var err error
	DB, err = sql.Open("postgres", dsn)
	if err != nil {
		return err
	}

	// Testa a conexão
	err = DB.Ping()
	if err != nil {
		return err
	}

	fmt.Println("✅ Conexão com PostgreSQL estabelecida")
	return nil
}

// GetLevels busca os níveis do banco de dados
func GetLevels() ([]models.Level, error) {
	query := "SELECT id, nome, descricao FROM levels"
	rows, err := DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var levels []models.Level
	for rows.Next() {
		var level models.Level
		err := rows.Scan(&level.ID, &level.Nome, &level.Desc)
		if err != nil {
			return nil, err
		}
		levels = append(levels, level)
	}

	return levels, nil
}

// GetQuestionsByLevel busca as perguntas do banco
func GetQuestionsByLevel(level string) ([]models.Question, error) {
	query := `
		SELECT id, enunciado, opcoes, resposta_correta
		FROM questions
		WHERE level = $1
		LIMIT 10
	`

	rows, err := DB.Query(query, level)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var questions []models.Question
	for rows.Next() {
		var question models.Question
		err := rows.Scan(
			&question.ID,
			&question.Enunciar,
			&question.Opcoes,
			&question.Resposta,
		)
		if err != nil {
			return nil, err
		}
		questions = append(questions, question)
	}

	return questions, nil
}

// SaveQuizResult salva o resultado do quiz
func SaveQuizResult(userID string, level string, acertos int, total int) error {
	query := `
		INSERT INTO quiz_results (user_id, level, acertos, total, pontuacao, data)
		VALUES ($1, $2, $3, $4, $5, NOW())
	`

	pontuacao := acertos * 10
	_, err := DB.Exec(query, userID, level, acertos, total, pontuacao)
	return err
}

// ============================================================
// ARQUIVO SQL PARA CRIAR AS TABELAS
// Arquivo: database/schema.sql
// ============================================================

/*
-- Tabela de níveis
CREATE TABLE IF NOT EXISTS levels (
  id VARCHAR(50) PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de perguntas
CREATE TABLE IF NOT EXISTS questions (
  id VARCHAR(100) PRIMARY KEY,
  level VARCHAR(50) NOT NULL REFERENCES levels(id),
  enunciado TEXT NOT NULL,
  opcoes TEXT[] NOT NULL,
  resposta_correta VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de usuários (para futuro)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  nome VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de resultados dos quizzes
CREATE TABLE IF NOT EXISTS quiz_results (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id),
  level VARCHAR(50) NOT NULL REFERENCES levels(id),
  acertos INT NOT NULL,
  total INT NOT NULL,
  pontuacao INT NOT NULL,
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX idx_questions_level ON questions(level);
CREATE INDEX idx_quiz_results_user ON quiz_results(user_id);
CREATE INDEX idx_quiz_results_data ON quiz_results(data);
*/

// ============================================================
// COMO USAR NO MAIN.GO
// ============================================================

/*
import (
	"qiabaco/database"
	"log"
)

func main() {
	// Configurar banco de dados
	dsn := "user=postgres password=password dbname=qiabaco host=localhost port=5432 sslmode=disable"
	
	err := database.InitDB(dsn)
	if err != nil {
		log.Fatal("Erro ao conectar ao banco:", err)
	}
	defer database.DB.Close()

	// ... resto do código
}
*/

// ============================================================
// COMO MODIFICAR handlers/quiz.go PARA USAR DB
// ============================================================

/*
// Antes (usando data mockados):
func GetQuestions(c *gin.Context) {
	level := c.DefaultQuery("level", "easy")
	questions := data.GetQuestionsByLevel(level)  // ← Dados mockados
	// ...
}

// Depois (usando PostgreSQL):
func GetQuestions(c *gin.Context) {
	level := c.DefaultQuery("level", "easy")
	questions, err := database.GetQuestionsByLevel(level)  // ← Do banco
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"erro": "Erro ao buscar perguntas",
		})
		return
	}
	// ... resto do código
}
*/

// ============================================================
// PASSO A PASSO PARA MIGRAR PARA PostgreSQL
// ============================================================

/*
1. Instalar driver PostgreSQL:
   go get github.com/lib/pq

2. Criar arquivo database/db.go
   (com as funções de conexão e queries)

3. Executar script schema.sql no banco

4. Modificar data/questions.go para usar database.GetQuestionsByLevel()

5. Modificar handlers/quiz.go para tratamento de erros do DB

6. Atualizar main.go para inicializar conexão

7. Testar todos os endpoints

A ÓTIMA NOTÍCIA:
- Nenhuma mudança é necessária nos models!
- Nenhuma mudança é necessária nas rotas!
- Apenas a lógica de busca de dados muda (handlers/data)
- Isso é ABSTRAÇÃO! 🎉
*/

// ============================================================
// VARIÁVEIS DE AMBIENTE RECOMENDADAS
// Arquivo: .env
// ============================================================

/*
# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=seu_password
DB_NAME=qiabaco
DB_SSLMODE=disable

# Server
PORT=8080
GIN_MODE=debug

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
*/

// ============================================================
// COMO LER VARIÁVEIS DE AMBIENTE
// Instalar: go get github.com/joho/godotenv
// ============================================================

/*
import (
	"os"
	"github.com/joho/godotenv"
)

func init() {
	godotenv.Load() // Carrega .env
}

func main() {
	dsn := fmt.Sprintf(
		"user=%s password=%s dbname=%s host=%s port=%s sslmode=%s",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_SSLMODE"),
	)
	
	database.InitDB(dsn)
}
*/

// ============================================================
// ROADMAP DE IMPLEMENTAÇÃO
// ============================================================

/*
FASE 1: Dados Mockados (ATUAL)
✅ API funcional
✅ Endpoints testáveis
✅ Frontend pronto para consumir

FASE 2: PostgreSQL
□ Instalar driver
□ Criar tabelas
□ Adaptar data access layer
□ Testar endpoints

FASE 3: Autenticação
□ Sistema de usuários
□ JWT tokens
□ Salvar resultados por usuário

FASE 4: Features Avançadas
□ Leaderboard
□ Histórico de quizzes
□ Streaks/sequências
□ Badges/conquistas

FASE 5: Deploy
□ Docker
□ Heroku/Railway/Render
□ Frontend React
*/
