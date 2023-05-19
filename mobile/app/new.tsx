import {
	View,
	Text,
	TouchableOpacity,
	Switch,
	TextInput,
	ScrollView,
} from 'react-native'
import NLWSTLogo from '../src/assets/nlw-spacetime-logo.svg'
import { Link } from 'expo-router'
import Icon from '@expo/vector-icons/Feather'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useState } from 'react'

export default function NewMemory() {
	const [isPublic, setIsPublic] = useState(false)

	const { bottom: paddingBottom, top: paddingTop } = useSafeAreaInsets()
	return (
		<ScrollView
			className="flex-1 px-8"
			contentContainerStyle={{ paddingBottom, paddingTop }}
		>
			<View className="mt-4 flex-row items-center justify-between">
				<NLWSTLogo />
				<Link href="/memories" asChild>
					<TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-purple-500">
						<Icon name="arrow-left" size={16} color="#FFF" />
					</TouchableOpacity>
				</Link>
			</View>
			<View className="mt-6 space-y-6">
				<View className="flex-row items-center gap-2">
					<Switch
						value={isPublic}
						onValueChange={setIsPublic}
						thumbColor={isPublic ? '#9b79ea' : '#9e9ea0'}
						trackColor={{ false: '#767577', true: '#372560' }}
					/>
					<Text className="font-body text-base text-gray-200">
						Tornar memória pública
					</Text>
				</View>

				<TouchableOpacity className="h-32 items-center justify-center rounded-lg border border-dashed border-gray-500 bg-black/20">
					<View className="flex-row items-center gap-2">
						<Icon name="image" color="#FFF" />
						<Text className="font-body text-sm text-gray-200">
							Adicionar foto ou vídeo de capa
						</Text>
					</View>
				</TouchableOpacity>

				<TextInput
					multiline
					className="p-0 font-body text-lg text-gray-50"
					placeholderTextColor="#56565a"
					placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
				/>

				<TouchableOpacity
					activeOpacity={0.75}
					className="mb-4 items-center rounded-full bg-green-500 px-5 py-3"
				>
					<Text className="font-alt text-sm font-bold uppercase text-black">
						Salvar
					</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	)
}
