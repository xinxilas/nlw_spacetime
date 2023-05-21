import { RequestInit, BodyInit_ } from 'node-fetch'

const apiHost = 'http://192.168.0.18:3333'

export const post = async function (
	path,
	body: BodyInit_,
	options: RequestInit = {},
) {
	try {
		options =
			body instanceof URLSearchParams ||
			body instanceof FormData ||
			body instanceof Blob
				? {
						...options,
						method: 'post',
						body,
				  }
				: {
						...options,
						method: 'post',
						headers: { ...options.headers, 'Content-Type': 'application/json' },
						body: JSON.stringify(body),
				  }
		const response = await fetch(apiHost + path, options)
		return await response.json()
	} catch (err) {}
}

export const get = async function (path, options: RequestInit = {}) {
	try {
		const response = await fetch(apiHost + path, options)
		return await response.json()
	} catch (err) {}
}
