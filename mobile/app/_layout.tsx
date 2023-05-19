import { styled } from 'nativewind'
import blurBg from '../src/assets/bg-blur.png'
import StripesSvg from '../src/assets/stripes.svg'
import { ImageBackground } from 'react-native'
import { SplashScreen, Stack } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import React, { useEffect, useState } from 'react'

import { StatusBar } from 'expo-status-bar'

import {
	useFonts,
	Roboto_400Regular,
	Roboto_700Bold,
} from '@expo-google-fonts/roboto'
import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'

const StyledStripes = styled(StripesSvg)

export default function Layout() {
	const [isUserAuthenticated, setUserAuthenticate] = useState<null | boolean>(
		null,
	)

	useEffect(() => {
		SecureStore.getItemAsync('token').then((token) => {
			setUserAuthenticate(!!token)
		})
	}, [])

	const [hasLoadedFonts] = useFonts({
		Roboto_400Regular,
		Roboto_700Bold,
		BaiJamjuree_700Bold,
	})

	if (!hasLoadedFonts) {
		return <SplashScreen />
	}

	return (
		<ImageBackground
			source={blurBg}
			className="relative flex-1 bg-gray-950"
			imageStyle={{ position: 'absolute', left: '-100%' }}
		>
			<StyledStripes className="absolute left-2" />
			<StatusBar />
			{/* style="auto" translucent */}

			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: { backgroundColor: 'transparent' },
				}}
			>
				<Stack.Screen name="index" redirect={isUserAuthenticated} />
				<Stack.Screen name="new" />
				<Stack.Screen name="memories" />
			</Stack>
		</ImageBackground>
	)
}
