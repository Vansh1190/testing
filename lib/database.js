import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';

const dataPath = path.join('/tmp', 'data.json');

// --- Internal Helper Functions ---

/**
 * Reads the entire database file.
 * @returns {Promise<object>} The parsed JSON data.
 */
async function readData() {
  try {
    console.log('Reading data from:', dataPath);
    const jsonData = await fs.readFile(dataPath, 'utf-8');
    if (!jsonData) {
        console.log('Data file is empty, returning default structure.');
        return { users: [] };
    }
    const data = JSON.parse(jsonData);
    // Basic validation to ensure 'users' array exists
    if (!Array.isArray(data.users)) {
        console.warn('Data file is malformed, "users" is not an array. Resetting.');
        return { users: [] };
    }
    return data;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('Data file not found. A new one will be created on write.');
      return { users: [] }; // Return default structure if file doesn't exist
    }
    console.error('Error reading from database:', error);
    throw new Error('Could not read from database.');
  }
}

/**
 * Writes data to the database file atomically.
 * @param {object} data The JSON data to write.
 */
async function writeData(data) {
  try {
    // Validate the structure before writing
    if (!data || !Array.isArray(data.users)) {
        throw new Error('Invalid data structure: "users" array is missing.');
    }
    console.log('Writing data to:', dataPath);
    const tempPath = dataPath + '.tmp';
    await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    await fs.rename(tempPath, dataPath);
    console.log('Data written successfully.');
  } catch (error) {
    console.error('Error writing to database:', error);
    // Clean up temp file on failure
    try {
      await fs.unlink(tempPath);
    } catch (cleanupError) {
      console.error('Error cleaning up temp file:', cleanupError);
    }
    throw new Error('Could not write to database.');
  }
}

/**
 * Generates a unique ID for a user.
 * @returns {string} A unique identifier.
 */
const generateId = () => {
    return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};


// --- Public API Functions ---

/**
 * Finds a user by their email address.
 * @param {string} email The email of the user to find.
 * @returns {Promise<object|null>} The user object or null if not found.
 */
export async function findUserByEmail(email) {
  try {
    console.log(`Attempting to find user by email: ${email}`);
    const data = await readData();
    const user = data.users.find((user) => user.email === email);
    if (user) {
        console.log(`User found with email: ${email}`);
    } else {
        console.log(`User not found with email: ${email}`);
    }
    return user || null;
  } catch (error) {
    console.error(`Error in findUserByEmail for ${email}:`, error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

/**
 * Adds a new user to the database.
 * @param {object} userData - The user data.
 * @param {string} userData.email - The user's email.
 * @param {string} userData.password - The user's plain text password.
 * @returns {Promise<object>} The newly created user object (without password).
 */
export async function addUser({ email, password }) {
  try {
    console.log(`Attempting to add new user with email: ${email}`);
    const data = await readData();

    const existingUser = data.users.find((user) => user.email === email);
    if (existingUser) {
      console.error(`Error adding user: email ${email} already exists.`);
      throw new Error('User with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();

    const newUser = {
      id: generateId(),
      email,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    };

    data.users.push(newUser);
    await writeData(data);
    console.log(`User ${email} added successfully with id: ${newUser.id}`);

    // Return user object without the password
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  } catch (error) {
    console.error(`Error in addUser for ${email}:`, error);
    throw error;
  }
}

/**
 * Validates user credentials.
 * @param {string} email The user's email.
 * @param {string} password The user's plain text password.
 * @returns {Promise<object|null>} The user object (without password) if valid, otherwise null.
 */
export async function validateUser(email, password) {
  try {
    console.log(`Validating credentials for user: ${email}`);
    const user = await findUserByEmail(email);

    if (!user) {
      console.log(`Validation failed: No user found for email ${email}.`);
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log(`Validation failed: Invalid password for email ${email}.`);
      return null;
    }

    console.log(`Credentials validated successfully for user: ${email}`);
    // Return user object without the password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error(`Error in validateUser for ${email}:`, error);
    throw error;
  }
}