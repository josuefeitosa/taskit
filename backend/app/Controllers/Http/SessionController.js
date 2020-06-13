class SessionController {
  async authenticate({ request, response, auth }) {
    try {
      const { email, password } = request.body;

      const token = await auth.attempt(email, password);

      return response
        .status(200)
        .json({ message: 'Autenticação realizada com sucesso!', token });
    } catch (error) {
      return response.status(400).json({
        message: 'Não foi possível realizar esta operação. Tente novamente!',
        error,
      });
    }
  }
}

module.exports = SessionController;
