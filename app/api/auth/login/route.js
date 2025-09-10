import { NextResponse } from 'next/server';
import { validateUser } from '@/lib/database';

export async function POST(request) {
  console.log('API: /api/auth/login POST request received');
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Input Validation
    if (!email || !password) {
      console.log('API Login: Validation failed - Missing email or password');
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // 2. Check credentials
    console.log(`API Login: Validating credentials for: ${email}`);
    const user = await validateUser(email, password);

    if (!user) {
      console.log(`API Login: Invalid credentials for: ${email}`);
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 } // 401 Unauthorized
      );
    }

    // 3. Return user data on success
    console.log(`API Login: Login successful for: ${email}`);
    return NextResponse.json(
      { success: true, data: user, message: 'Login successful.' },
      { status: 200 }
    );

  } catch (error) {
    if (error instanceof SyntaxError) {
        console.error('API Login: Invalid JSON in request body', error);
        return NextResponse.json({ success: false, error: 'Invalid request format.' }, { status: 400 });
    }
    console.error('API Login: Internal server error:', error);
    return NextResponse.json(
      { success: false, error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}