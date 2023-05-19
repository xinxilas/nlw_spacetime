import { StatusBar } from 'expo-status-bar'
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native'
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'
import { styled } from 'nativewind'
import { useEffect } from 'react'
import { useRouter } from 'expo-router'

import * as SecureStore from 'expo-secure-store'

import {
	useFonts,
	Roboto_400Regular,
	Roboto_700Bold,
} from '@expo-google-fonts/roboto'
import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'

import blurBg from '../src/assets/bg-blur.png'
import StripesSvg from '../src/assets/stripes.svg'
import NLWSTLogo from '../src/assets/nlw-spacetime-logo.svg'

const StyledStripes = styled(StripesSvg)

const discovery = {
	authorizationEndpoint: 'https://github.com/login/oauth/authorize',
	tokenEndpoint: 'https://github.com/login/oauth/access_token',
	revocationEndpoint:
		'https://github.com/settings/connections/applications/1c31da1e325201c236b8',
}

export default function App() {
	const router = useRouter()

	const [hasLoadedFonts] = useFonts({
		Roboto_400Regular,
		Roboto_700Bold,
		BaiJamjuree_700Bold,
	})

	const [, authResponse, signInWithGithub] = useAuthRequest(
		{
			clientId: '1c31da1e325201c236b8',
			scopes: ['identity'],
			redirectUri: makeRedirectUri({
				scheme: 'nlwspacetime',
			}),
		},
		discovery,
	)

	useEffect(() => {
		if (authResponse?.type === 'success') {
			console.log('Sucess')
			const { code } = authResponse.params
			fetch('http://192.168.0.18:3333/register', {
				method: 'POST',
				body: `{"code":"${code}"}`,
			})
				.then((response) => response.json())
				.then(async ({ token }) => {
					await SecureStore.setItemAsync('token', token)
					router.push('/memories')
				})
				.catch((e) => console.error(e))
		}
	}, [authResponse])

	if (!hasLoadedFonts) {
		return null
	}

	return (
		<ImageBackground
			source={blurBg}
			className="relative flex-1 items-center bg-gray-950 px-8 py-10"
			imageStyle={{ position: 'absolute', left: '-100%' }}
		>
			<StyledStripes className="absolute left-2" />
			<View className="flex-1 items-center justify-center gap-6">
				<NLWSTLogo />
				<View className="space-y-2">
					<Text className="text-center font-title text-2xl leading-tight text-gray-50">
						Sua cápsula do tempo
					</Text>
					<Text className="text-center font-body text-base leading-relaxed text-gray-100">
						Colecione momentos marcantes da sua jornada e compartilhe (se
						quiser) com o mundo!
					</Text>
				</View>

				<TouchableOpacity
					activeOpacity={0.75}
					className="rounded-full bg-green-500 px-5 py-3"
					onPress={() => signInWithGithub()}
				>
					<Text className="font-alt text-sm font-bold uppercase text-black">
						Cadastrar Lembrança
					</Text>
				</TouchableOpacity>
			</View>

			<Text className="text-center font-body text-sm font-bold leading-relaxed text-gray-200">
				Feito com 💜 no NLW da Rocketseat
			</Text>

			<StatusBar />
			{/* style="auto" translucent */}
		</ImageBackground>
	)
}
