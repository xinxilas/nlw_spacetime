import { Text, TouchableOpacity, View } from 'react-native'
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'
import * as SecureStore from 'expo-secure-store'
import React, { useEffect } from 'react'
import { useRouter } from 'expo-router'
import NLWSTLogo from '../src/assets/nlw-spacetime-logo.svg'

const discovery = {
	authorizationEndpoint: 'https://github.com/login/oauth/authorize',
	tokenEndpoint: 'https://github.com/login/oauth/access_token',
	revocationEndpoint:
		'https://github.com/settings/connections/applications/1c31da1e325201c236b8',
}

export default function App() {
	const router = useRouter()

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

	return (
		<View className="flex-1 items-center px-8 py-10">
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
		</View>
	)
}
