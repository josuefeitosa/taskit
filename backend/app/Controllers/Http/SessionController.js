const User = use('App/Models/User');
class SessionController {
  async authenticate({ request, response, auth }) {
    try {
      const { email, password } = request.body;

      const token = await auth.attempt(email, password);
      const user = await User.findByOrFail('email', email);

      return response.status(200).json({
        message: 'Autenticação realizada com sucesso!',
        token,
        user: user.toJSON(),
      });
    } catch (error) {
      return response.status(400).json({
        message: 'Não foi possível realizar esta operação. Tente novamente!',
        error,
      });
    }
  }
}

module.exports = SessionController;
