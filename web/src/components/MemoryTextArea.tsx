'use client'

import { useState } from 'react'

export default function MediaPicker() {
	const [memoryText, setMemoryText] = useState<string | null>(null)

	return (
		<textarea
			onChange={(e) => setMemoryText(e.target.value)}
			name="content"
			spellCheck={false}
			placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
			className={`w-full ${
				!memoryText && 'animate-pulse'
			} flex-1 resize-none rounded border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 placeholder:text-gray-400 placeholder:underline focus:ring-0`}
		/>
	)
}
