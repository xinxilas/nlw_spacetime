import { EmptyMemories } from '@/components/EmptyMemories'
import { cookies } from 'next/headers'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

dayjs.locale(ptBR)

interface Memory {
	id: string
	coverUrl: string
	excerpt: string
	createdAt: string
}

export default async function Home() {
	const isAuthenticated = cookies().has('token')
	if (!isAuthenticated) return <EmptyMemories />

	const token = cookies().get('token')?.value
	let memories: Memory[] = []
	try {
		const response = await fetch(
			process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/memories',
			{
				headers: { Authorization: `Bearer ${token}` },
			},
		)
		memories = await response.json()
	} catch (e) {}

	return (
		<div className="flex flex-col gap-10 p-8">
			{memories.map((memory) => {
				return (
					<div key={memory.id} className="space-y-4">
						<time className="-ml-8 flex items-center gap-2 text-sm text-gray-100 before:h-px before:w-5 before:bg-gray-50">
							{dayjs(memory.createdAt).format('D[ de ]MMMM[, ]YYYY')}
						</time>
						{memory.coverUrl && (
							<Image
								src={memory.coverUrl}
								alt=""
								width={592}
								height={280}
								className="aspect-video w-full rounded-lg object-cover"
							/>
						)}
						<p className="text-lg leading-relaxed text-gray-100">
							{memory.excerpt}
						</p>
						<Link
							href={`/memories/${memory.id}`}
							className="flex items-center gap-2 text-sm text-gray-200 hover:text-gray-100"
						>
							Ler mais
							<ArrowRight className="h-4 w-4" />
						</Link>
					</div>
				)
			})}
		</div>
	)
}
