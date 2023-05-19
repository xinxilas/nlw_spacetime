import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url)
	const code = searchParams.get('code')

	const redirectTo = request.cookies.get('redirectTo')?.value

	const registerResponse = await fetch(
		process.env.BACKEND_BASE_URL + '/register',
		{ method: 'POST', body: `{"code":"${code}"}` },
	)

	const { token } = await registerResponse.json()

	const redirectURL = redirectTo ?? new URL('/', request.url)

	const cookieExpiresInSeconds = 60 * 60 * 24 * 15 // 15 days

	return NextResponse.redirect(redirectURL, {
		headers: {
			'Set-Cookie': `token=${token}; Path=/; max-age=${cookieExpiresInSeconds};`,
		},
	})
}
