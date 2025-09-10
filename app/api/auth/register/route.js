import { NextResponse } from 'next/server';
import { addUser, findUserByEmail } from '@/lib/database';

// Basic email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  console.log('API: /api/auth/register POST request received');
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Input Validation
    if (!email || !password) {
      console.log('API Register: Validation failed - Missing email or password');
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    if (!emailRegex.test(email)) {
        console.log(`API Register: Validation failed - Invalid email format: ${email}`);
        return NextResponse.json(
            { success: false, error: 'Please enter a valid email address.' },
            { status: 400 }
        );
    }

    if (password.length < 6) {
        console.log('API Register: Validation failed - Password too short');
        return NextResponse.json(
            { success: false, error: 'Password must be at least 6 characters long.' },
            { status: 400 }
        );
    }

    // 2. Check if user already exists
    console.log(`API Register: Checking if user exists with email: ${email}`);
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      console.log(`API Register: User already exists with email: ${email}`);
      return NextResponse.json(
        { success: false, error: 'User with this email already exists.' },
        { status: 409 } // 409 Conflict
      );
    }

    // 3. Add new user
    console.log(`API Register: Adding new user with email: ${email}`);
    const newUser = await addUser({ email, password });

    // 4. Return success response
    console.log(`API Register: User registered successfully: ${email}`);
    return NextResponse.json(
      { success: true, data: newUser, message: 'Registration successful.' },
      { status: 201 } // 201 Created
    );

  } catch (error) {
    if (error instanceof SyntaxError) {
        console.error('API Register: Invalid JSON in request body', error);
        return NextResponse.json({ success: false, error: 'Invalid request format.' }, { status: 400 });
    }
    console.error('API Register: Internal server error:', error.message);
    // Use the error message from lib/database if it's a known error
    const errorMessage = error.message.includes('User with this email already exists') 
        ? error.message 
        : 'An internal server error occurred.';
    const errorStatus = error.message.includes('User with this email already exists') ? 409 : 500;

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: errorStatus }
    );
  }
}