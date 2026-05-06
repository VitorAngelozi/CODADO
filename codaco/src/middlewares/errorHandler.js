function errorHandler(err, _req, res, _next) {
  console.error(err);
  return res.status(500).json({ erro: 'Erro interno do servidor' });
}

module.exports = {
  errorHandler
};
