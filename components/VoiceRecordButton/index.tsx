import { useVoiceAPI } from "@/api/useVoiceAPI";
import { useVoicePlayer } from "@/hooks/useAudioPlayer";
import { usePulseAnimation } from "@/hooks/usePulseAnimation";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { setAudioModeAsync } from "expo-audio";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Animated, StyleSheet, View } from "react-native";
import { PulseRing } from "../PulseRing";
import { VoiceButton } from "../VoiceButton";

const VoiceRecordButton = () => {
	const scaleAnim = useRef(new Animated.Value(1)).current;

	const [audioSource, setAudioSource] = useState<string | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);

	const {
		hasPermission,
		isRecording,
		startRecording,
		stopRecording,
		requestMicrophonePermission,
	} = useVoiceRecording();

	const { speechToText, getChatResponse, textToSpeech } = useVoiceAPI();
	const { player, playAudio } = useVoicePlayer(audioSource);

	const recordingPulseAnim = usePulseAnimation(isRecording);
	const playingPulseAnim = usePulseAnimation(isPlaying);

	useEffect(() => {
		if (audioSource && player.playing) {
			setIsPlaying(true);
		} else {
			setIsPlaying(false);
		}
	}, [audioSource, player.playing]);

	const processVoiceConversation = async (audioUri: string) => {
		try {
			setIsProcessing(true);

			const transcribedText = await speechToText(audioUri);

			const aiResponse = await getChatResponse(transcribedText);

			const audioBase64 = await textToSpeech(aiResponse);

			await playAudio(audioBase64!);

			setIsProcessing(false);

			return {
				userText: transcribedText,
				aiResponse: aiResponse,
			};
		} catch (error) {
			console.error("Voice conversation error:", error);
			setIsProcessing(false);
			Alert.alert("Error", "Failed to process voice conversation");
			throw error;
		}
	};

	const handlePressIn = async () => {
		try {
			if (!hasPermission) {
				const granted = await requestMicrophonePermission();
				if (!granted) {
					return;
				}
			}

			await setAudioModeAsync({
				playsInSilentMode: true,
				allowsRecording: true,
			});

			await startRecording();
		} catch (error) {
			console.error("Error in handlePressIn:", error);
			Alert.alert("Error", "Failed to start recording");
		}
	};

	const handlePressOut = async () => {
		try {
			if (!isRecording) {
				return;
			}

			const uri = await stopRecording();

			if (uri) {
				await processVoiceConversation(uri);
			} else {
				Alert.alert("Error", "No audio was recorded");
			}
		} catch (error) {
			console.error("Error in handlePressOut:", error);
			Alert.alert("Error", "Failed to stop recording");
			setIsProcessing(false);
		}
	};

	return (
		<View style={styles.container}>
			{isRecording && <PulseRing pulseAnim={recordingPulseAnim} />}
			{isPlaying && <PulseRing pulseAnim={playingPulseAnim} isPlaying />}

			<VoiceButton
				scaleAnim={scaleAnim}
				isRecording={isRecording}
				isPlaying={isPlaying}
				isProcessing={isProcessing}
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
			/>
		</View>
	);
};

export default VoiceRecordButton;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
