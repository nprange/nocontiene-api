import { db } from 'infra/db/database';
import { users } from 'infra/db/schema';
import {
  type UserSchema,
  type UserInputValues,
  userSchema,
  userInputSchema,
} from '../schemas/userSchema';
import { sql } from 'drizzle-orm';
import { NotFoundError, ValidationError } from 'infra/errors';

async function findOneByUsername(username: string): Promise<UserSchema> {
  const userFound = await runSelect(username);

  return userSchema.parse(userFound);

  async function runSelect(username: string) {
    const [result] = await db
      .select()
      .from(users)
      .where(sql`lower(${users.username}) = lower(${username})`)
      .limit(1);

    if (!result) {
      throw new NotFoundError({
        message: 'The informed username was not found.',
        action: 'Verify if the username is correct and try again.',
      });
    }
    return result;
  }
}

async function create(userInputValues: UserInputValues): Promise<UserSchema> {
  await validateUniqueEmail(userInputValues.email);
  await validateUniqueUsername(userInputValues.username);

  const createdUser = await runInsert(userInputValues);
  return userSchema.parse(createdUser);

  async function validateUniqueEmail(email: string) {
    const results = await db
      .select({ email: users.email })
      .from(users)
      .where(sql`lower(${users.email}) = lower(${email})`);

    if (results.length > 0) {
      throw new ValidationError({
        message: 'This email address is not available.',
        action: 'Choose a different address.',
      });
    }
  }

  async function validateUniqueUsername(username: string) {
    const results = await db
      .select({ username: users.username })
      .from(users)
      .where(sql`lower(${users.username}) = lower(${username})`);

    if (results.length > 0) {
      throw new ValidationError({
        message: 'This username is not available.',
        action: 'Choose a different username.',
      });
    }
  }

  async function runInsert(userInputValues: UserInputValues) {
    const { first_name, last_name, username, email, password } =
      userInputSchema.parse(userInputValues);

    const [createdUser] = await db
      .insert(users)
      .values({
        first_name,
        last_name,
        username,
        email,
        password,
      })
      .returning();

    return createdUser;
  }
}

const user = {
  create,
  findOneByUsername,
};

export default user;
