// ============================================================
// EXEMPLOS DE CONSUMO DA API DO QIABACO EM REACT
// ============================================================

// --- 1. Configurar a URL base da API ---
const API_BASE_URL = 'http://localhost:8080';

// --- 2. Função auxiliar para fazer requisições ---
const fetchAPI = async (endpoint, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
};

// ============================================================
// EXEMPLO 1: Obter os níveis disponíveis
// ============================================================
const getLevels = async () => {
  try {
    const data = await fetchAPI('/levels');
    console.log('Níveis disponíveis:', data);
    // data.levels conterá:
    // [
    //   { id: 'easy', nome: 'Fácil', desc: '...' },
    //   { id: 'medium', nome: 'Médio', desc: '...' },
    //   { id: 'hard', nome: 'Difícil', desc: '...' }
    // ]
    return data.levels;
  } catch (error) {
    console.error('Erro ao buscar níveis:', error);
  }
};

// ============================================================
// EXEMPLO 2: Obter perguntas de um nível específico
// ============================================================
const getQuestions = async (level = 'easy') => {
  try {
    const data = await fetchAPI(`/questions?level=${level}`);
    console.log('Perguntas carregadas:', data);
    // data conterá:
    // {
    //   level: 'easy',
    //   total: 10,
    //   perguntas: [
    //     {
    //       id: 'q1_easy',
    //       enunciar: 'Quanto é 5 + 3?',
    //       opcoes: ['7', '8', '9', '10'],
    //       resposta: '8'
    //     },
    //     ...
    //   ]
    // }
    return data;
  } catch (error) {
    console.error('Erro ao buscar perguntas:', error);
  }
};

// ============================================================
// EXEMPLO 3: Submeter respostas e obter resultado
// ============================================================
const submitAnswers = async (level, respostas) => {
  try {
    // Estrutura esperada:
    // {
    //   level: 'easy',
    //   respostas: [
    //     { pergunta_id: 'q1_easy', opcao: '8' },
    //     { pergunta_id: 'q2_easy', opcao: '8' },
    //     ...
    //   ]
    // }
    
    const data = await fetchAPI('/submit', 'POST', {
      level,
      respostas,
    });

    console.log('Resultado:', data);
    // data conterá:
    // {
    //   acertos: 9,
    //   total: 10,
    //   pontuacao: 90,
    //   percentual: 90,
    //   mensagem: 'Excelente! 👏 Muito bom!'
    // }
    return data;
  } catch (error) {
    console.error('Erro ao submeter respostas:', error);
  }
};

// ============================================================
// EXEMPLO 4: Componente React completo (simplificado)
// ============================================================
import React, { useState, useEffect } from 'react';

export function QuizApp() {
  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Carrega os níveis quando o componente monta
  useEffect(() => {
    const loadLevels = async () => {
      setLoading(true);
      const data = await getLevels();
      setLevels(data);
      setLoading(false);
    };
    loadLevels();
  }, []);

  // Carrega as perguntas quando um nível é selecionado
  const handleLevelSelect = async (levelId) => {
    setSelectedLevel(levelId);
    setLoading(true);
    const data = await getQuestions(levelId);
    setQuestions(data);
    setAnswers({}); // Reseta as respostas
    setResult(null); // Reseta o resultado
    setLoading(false);
  };

  // Manipula a seleção de uma resposta
  const handleAnswerChange = (perguntaId, opcao) => {
    setAnswers({
      ...answers,
      [perguntaId]: opcao,
    });
  };

  // Submete as respostas
  const handleSubmit = async () => {
    const respostasArray = questions.perguntas.map((pergunta) => ({
      pergunta_id: pergunta.id,
      opcao: answers[pergunta.id] || '',
    }));

    setLoading(true);
    const resultado = await submitAnswers(selectedLevel, respostasArray);
    setResult(resultado);
    setLoading(false);
  };

  // Volta para tela de seleção de níveis
  const handleRestart = () => {
    setSelectedLevel(null);
    setQuestions(null);
    setAnswers({});
    setResult(null);
  };

  // Tela inicial com seleção de níveis
  if (!selectedLevel) {
    return (
      <div>
        <h1>🎯 Qiabaco - Quiz de Matemática</h1>
        <h2>Escolha um nível:</h2>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div>
            {levels.map((level) => (
              <button
                key={level.id}
                onClick={() => handleLevelSelect(level.id)}
              >
                {level.nome} - {level.desc}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Tela de resultado
  if (result) {
    return (
      <div>
        <h1>📊 Resultado</h1>
        <p>Acertos: {result.acertos} de {result.total}</p>
        <p>Pontuação: {result.pontuacao} pontos</p>
        <p>Percentual: {result.percentual.toFixed(1)}%</p>
        <h2>{result.mensagem}</h2>
        <button onClick={handleRestart}>Voltar</button>
        <button onClick={() => handleLevelSelect(selectedLevel)}>
          Tentar novamente
        </button>
      </div>
    );
  }

  // Tela do quiz
  if (questions) {
    return (
      <div>
        <h1>📚 {questions.total} Perguntas - Nível {selectedLevel}</h1>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div>
            {questions.perguntas.map((pergunta, index) => (
              <div key={pergunta.id}>
                <h3>{index + 1}. {pergunta.enunciar}</h3>
                <div>
                  {pergunta.opcoes.map((opcao) => (
                    <label key={opcao}>
                      <input
                        type="radio"
                        name={pergunta.id}
                        value={opcao}
                        checked={answers[pergunta.id] === opcao}
                        onChange={(e) =>
                          handleAnswerChange(pergunta.id, e.target.value)
                        }
                      />
                      {opcao}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Respostas'}
            </button>
            <button onClick={handleRestart}>Cancelar</button>
          </div>
        )}
      </div>
    );
  }

  return <p>Carregando...</p>;
}

// ============================================================
// EXEMPLO 5: Como usar com Axios (alternativa a fetch)
// ============================================================
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getLevelsWithAxios = async () => {
  try {
    const response = await axiosInstance.get('/levels');
    return response.data.levels;
  } catch (error) {
    console.error('Erro:', error);
  }
};

const getQuestionsWithAxios = async (level) => {
  try {
    const response = await axiosInstance.get('/questions', {
      params: { level },
    });
    return response.data;
  } catch (error) {
    console.error('Erro:', error);
  }
};

const submitAnswersWithAxios = async (level, respostas) => {
  try {
    const response = await axiosInstance.post('/submit', {
      level,
      respostas,
    });
    return response.data;
  } catch (error) {
    console.error('Erro:', error);
  }
};

export default QuizApp;
