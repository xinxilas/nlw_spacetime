import { Link } from 'expo-router'
import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

export default function Memories() {
	return (
		<View className="flex-1 items-center justify-center">
			<Link href="/new" asChild>
				<Text className="text-8xl text-cyan-100">Voltar</Text>
			</Link>
		</View>
	)
}
