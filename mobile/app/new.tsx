import {
	View,
	Text,
	TouchableOpacity,
	Switch,
	TextInput,
	ScrollView,
	Image as ImageReact,
} from 'react-native'
import NLWSTLogo from '../src/assets/nlw-spacetime-logo.svg'
import { Link, useRouter } from 'expo-router'
import Icon from '@expo/vector-icons/Feather'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import * as SecureStore from 'expo-secure-store'
import { post } from '../lib/api'

export default function NewMemory() {
	const { bottom: paddingBottom, top: paddingTop } = useSafeAreaInsets()
	const router = useRouter()

	const [isPublic, setIsPublic] = useState(false)
	const [content, setContet] = useState('')
	const [preview, setPreview] = useState<string | null>(null)

	async function openImagePicker() {
		try {
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				quality: 1,
			})

			if (result.assets[0]) {
				setPreview(result.assets[0].uri)
			}
		} catch (err) {
			// err
		}
	}

	async function handleCreateMemory() {
		const token = await SecureStore.getItemAsync('token')

		let coverUrl = ''

		if (preview) {
			const uploadFormData = new FormData()
			uploadFormData.append('file', {
				uri: preview,
				name: 'image.jpg',
				type: 'image/jpeg',
			} as any)

			const uploadResponse = await post('/upload', uploadFormData, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'multipart/form-data',
				},
			})
			coverUrl = uploadResponse?.fileUrl
		}

		await post(
			'/memories',
			{
				content,
				isPublic,
				coverUrl,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		)

		router.push('/memories')
	}

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

				<TouchableOpacity
					onPress={openImagePicker}
					activeOpacity={0.75}
					className="h-32 items-center justify-center rounded-lg border border-dashed border-gray-500 bg-black/20"
				>
					{preview ? (
						<ImageReact
							source={{ uri: preview }}
							className="h-full w-full rounded-lg object-cover"
						/>
					) : (
						<View className="flex-row items-center gap-2">
							<Icon name="image" color="#FFF" />
							<Text className="font-body text-sm text-gray-200">
								Adicionar foto ou vídeo de capa
							</Text>
						</View>
					)}
				</TouchableOpacity>

				<TextInput
					value={content}
					onChangeText={setContet}
					multiline
					className="p-0 font-body text-lg text-gray-50"
					placeholderTextColor="#56565a"
					placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
				/>

				<TouchableOpacity
					onPress={handleCreateMemory}
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
