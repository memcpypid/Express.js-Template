/**
 * Data Transfer Object for User
 * Used to filter sensitive data from user object before sending it to client.
 */
class UserDTO {
  constructor(user) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
    this.is_verified = user.is_verified;
    this.created_at = user.createdAt;
    this.updated_at = user.updatedAt;
  }

  static fromUser(user) {
    if (!user) return null;
    return new UserDTO(user);
  }

  static fromUsers(users) {
    if (!users || !Array.isArray(users)) return [];
    return users.map((user) => new UserDTO(user));
  }
}

export default UserDTO;
