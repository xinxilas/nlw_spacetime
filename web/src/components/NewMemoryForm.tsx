'use client'

import { Camera } from 'lucide-react'
import MediaPicker from './MediaPicker'
import MemoryTextArea from './MemoryTextArea'
import { FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function NewMemoryForm() {
	const router = useRouter()

	async function handleCreateMemory(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()

		const formData = new FormData(event.currentTarget)

		const fileToUpload = formData.get('coverUrl') as File

		let coverUrl = ''

		if (fileToUpload.name) {
			const uploadFormData = new FormData()
			uploadFormData.set('file', fileToUpload)

			const uploadResponse = await fetch(
				process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/upload',
				{
					method: 'POST',
					body: uploadFormData,
					headers: { 'Content-Type': 'application/json' },
				},
			)
			if (uploadResponse.ok) {
				const json = await uploadResponse.json()
				coverUrl = json.fileUrl
			}
		}

		const tokenCookieRegex = /( |^)token=(.+?)(?=;|$)/
		const regexResult = tokenCookieRegex.exec(document.cookie)
		const token = regexResult && regexResult[2]
		// 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUmVuYXRvIExhIExhaW5hIiwiYXZhdGFyVXJsIjoiaHR0cHM6Ly9hdmF0YXJzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzM4Njc0NzA1P3Y9NCIsInN1YiI6IjQ4NzZkMzQ3LWZjOTItNDYwYi1hN2M3LWYxMmNjYTc4N2JiNCIsImlhdCI6MTY4NDUyNDAyOCwiZXhwIjoxNjg1MzAxNjI4fQ.WkDGiJgmu5ChfAvPh7eAwJiKzCCSYkL7uvazhykTA7k; atlassian.xsrf.token=B5MN-2AS6-10E1-K9VZ_c49395d3d91ff2e0bd17a66f65dc37cd1662b65b_lin'

		const body = JSON.stringify({
			coverUrl,
			content: formData.get('content'),
			isPublic: formData.get('isPublic'),
		})

		await fetch(process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/memories', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			body,
		})

		router.push('/')
	}
	return (
		<form onSubmit={handleCreateMemory} className="flex flex-1 flex-col gap-2">
			<div className="flex flex-wrap items-center gap-4">
				<label
					htmlFor="media"
					className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
				>
					<Camera className="h-4 w-4" />
					Anexar mídia
				</label>
				<label
					htmlFor="isPublic"
					className="flex items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
				>
					<input
						type="checkbox"
						name="isPublic"
						id="isPublic"
						className="h-4 w-4 rounded border-gray-400 bg-gray-700 text-purple-500 focus:ring-purple-600 focus:ring-offset-0"
					/>
					Memória pública
				</label>
				<label
					htmlFor="date"
					className="flex items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
				>
					<input
						type="date"
						name="date"
						id="date"
						className="max-w-[110px] rounded border-gray-400 bg-gray-700 p-1 text-sm focus:ring-purple-600 focus:ring-offset-0"
					/>
					Data
				</label>
			</div>

			<MediaPicker />

			<MemoryTextArea />

			<button
				type="submit"
				className="font-alttext-sm inline-block w-[75%] self-center rounded-full bg-green-500 px-5 py-3 uppercase leading-none text-black transition-colors hover:bg-green-900 hover:text-purple-400"
			>
				Salvar
			</button>
		</form>
	)
}
