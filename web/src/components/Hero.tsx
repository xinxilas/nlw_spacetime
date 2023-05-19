import Image from 'next/image'
import nlwSTLogo from '../assets/nlw-spacetime-logo.svg'

export function Hero() {
	return (
		<div className="my-5 space-y-5">
			<Image src={nlwSTLogo} alt="NLW Spacetime" />
			<div className="max-w-[420px] space-y-1">
				<h1 className="text-5xl font-bold leading-tight text-gray-50">
					Sua cápsula do tempo
				</h1>
				<p className="text-lg leading-relaxed">
					Colecione momentos marcantes da sua jornada e compartilhe (se quiser)
					com o mundo!
				</p>
			</div>

			<a
				href=""
				className="font-alttext-sm inline-block rounded-full bg-green-500 px-5 py-3 uppercase leading-none text-black transition-colors hover:bg-green-900 hover:text-purple-400"
			>
				CADASTRAR LEMBRANÇA
			</a>
		</div>
	)
}
