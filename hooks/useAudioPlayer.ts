import {
	setAudioModeAsync,
	useAudioPlayer as useExpoAudioPlayer,
} from "expo-audio";
import * as FileSystem from "expo-file-system/legacy";
import { Alert } from "react-native";

export const useVoicePlayer = (audioSource: string | null) => {
	const player = useExpoAudioPlayer(audioSource);

	const playAudio = async (audioBase64: string) => {
		try {
			const fileUri = `${
				FileSystem.cacheDirectory
			}temp_audio_${Date.now()}.mp3`;

			await FileSystem.writeAsStringAsync(fileUri, audioBase64, {
				encoding: FileSystem.EncodingType.Base64,
			});

			await setAudioModeAsync({
				playsInSilentMode: true,
				allowsRecording: false,
			});

			player.replace(fileUri);
			player.play();
		} catch (error) {
			console.error("Audio playback error:", error);
			Alert.alert("Error", "Failed to play audio");
			throw error;
		}
	};

	return {
		player,
		playAudio,
	};
};
