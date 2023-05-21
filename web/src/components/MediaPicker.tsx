'use client'

import { ChangeEvent, useState } from 'react'

export default function MediaPicker() {
	const [preview, setPreview] = useState<string | null>(null)

	function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
		const { files } = event.target
		if (!files) {
			return 1
		}
		const previewURL = URL.createObjectURL(files[0])
		setPreview(previewURL)
	}

	return (
		<>
			<input
				onChange={onFileSelected}
				className="invisible h-0 w-0"
				type="file"
				name="coverUrl"
				id="media"
				accept="image/png, image/gif, image/jpeg"
			/>
			{preview && (
				<img
					src={preview}
					alt=""
					className="aspect-video w-full rounded-lg object-cover"
				/>
			)}
		</>
	)
}
