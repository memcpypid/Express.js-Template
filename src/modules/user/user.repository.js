import BaseRepository from '../../common/base.repository.js';
import User from './user.model.js';

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return await this.model.findOne({ where: { email } });
  }

  // Extend with more specific queries if needed
}

export default UserRepository;
