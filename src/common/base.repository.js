/**
 * Base Repository for Sequelize CRUD operations.
 */
class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findAll(options = {}) {
    return await this.model.findAll(options);
  }

  async findByPk(id, options = {}) {
    return await this.model.findByPk(id, options);
  }

  async findOne(options = {}) {
    return await this.model.findOne(options);
  }

  async create(data, options = {}) {
    return await this.model.create(data, options);
  }

  async update(id, data, options = {}) {
    const instance = await this.findByPk(id);
    if (!instance) return null;
    return await instance.update(data, options);
  }

  async delete(id, options = {}) {
    const instance = await this.findByPk(id);
    if (!instance) return null;
    return await instance.destroy(options);
  }

  async count(options = {}) {
    return await this.model.count(options);
  }
}

export default BaseRepository;
