/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: [
			'avatars.githubusercontent.com',
			'github.com',
			process.env.NEXT_PUBLIC_BACKEND_DOMAIN,
		],
	},
}

module.exports = nextConfig
