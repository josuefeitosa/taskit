const User = use('App/Models/User');

class UserController {
  async index({ response }) {
    try {
      const users = await User.all();

      const usersJSON = users.toJSON().map(user => {
        delete user.password;
        return user;
      });

      return response.status(200).json(usersJSON);
    } catch (error) {
      return response.status(400).json({
        message: 'Não foi possível realizar esta operação. Tente novamente!',
        error,
      });
    }
  }

  async create({ request, response }) {
    try {
      const { name, email, password } = request.body;

      const userData = { name, email, password };

      const createdUser = await User.create(userData);

      const createdUserJSON = createdUser.toJSON();
      delete createdUserJSON.password;

      return response.status(201).json({
        message: 'Usuário criado com sucesso! ',
        user: createdUserJSON,
      });
    } catch (error) {
      return response.status(400).json({
        message: 'Não foi possível realizar esta operação. Tente novamente!',
        error,
      });
    }
  }

  async update({ request, response, params }) {
    try {
      const { id } = params;

      const user = await User.findOrFail(id);

      const data = request.only(['name', 'email']);

      await user.merge(data);
      await user.save();

      const userJSON = user.toJSON();
      delete userJSON.password;

      return response
        .status(200)
        .json({ message: 'Usuário alterado com sucesso!', userJSON });
    } catch (error) {
      return response.status(400).json({
        message: 'Não foi possível realizar esta operação. Tente novamente!',
        error,
      });
    }
  }

  async delete({ response, params }) {
    try {
      const { id } = params;

      const user = await User.findOrFail(id);

      await user.delete();

      return response
        .status(204)
        .json({ message: 'Usuário deletado com sucesso!' });
    } catch (error) {
      return response.status(400).json({
        messagE: 'Não foi possível realizar esta operação. Tente novamente!',
        error,
      });
    }
  }

  async show({ response, params }) {
    try {
      const { id } = params;

      const user = await User.findOrFail(id);

      const userJSON = user.toJSON();
      delete userJSON.password;

      return response.status(200).json(userJSON);
    } catch (error) {
      return response.status(400).json({
        message: 'Não foi possível realizar esta operação. Tente novamente!',
        error,
      });
    }
  }
}

module.exports = UserController;
