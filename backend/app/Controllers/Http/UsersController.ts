import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';

export default class UsersController {
  public async create({ request, response }: HttpContextContract) {
    const { name, email, password } = request.all();

    const userData = { name, email, password };

    try {
      const user = User.create(userData);

      return response.status(201).json((await user).serialize());
    } catch (error) {
      return response
        .status(400)
        .json({ message: 'Operation failed. Try again.', error });
    }
  }

  public async index({ response }: HttpContextContract) {
    try {
      const users = await User.all();

      return response.status(200).json(users);
    } catch (error) {
      return response
        .status(400)
        .json({ message: 'Operation failed. Try again.', error });
    }
  }
}
