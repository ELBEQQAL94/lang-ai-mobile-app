import {
	AudioModule,
	RecordingPresets,
	setAudioModeAsync,
	useAudioPlayer,
	useAudioRecorder,
	useAudioRecorderState,
} from "expo-audio";
import * as FileSystem from "expo-file-system/legacy";

import React, { useEffect, useRef, useState } from "react";
import {
	Alert,
	Animated,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";

const VoiceRecordButton = () => {
	const scaleAnim = useRef(new Animated.Value(1)).current;
	const pulseAnim = useRef(new Animated.Value(1)).current;

	const playingPulseAnim = useRef(new Animated.Value(1)).current;
	const [hasPermission, setHasPermission] = useState(false);
	const [isRecording, setIsRecording] = useState(false);
	const [audioSource, setAudioSource] = useState<string | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const [userText, setUserText] = useState("");
	const [aiText, setAiText] = useState("");
	const [isPlaying, setIsPlaying] = useState(true);

	const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
	const recorderState = useAudioRecorderState(audioRecorder);
	const player = useAudioPlayer(audioSource);

	useEffect(() => {
		let animation: Animated.CompositeAnimation;

		if (isRecording) {
			animation = Animated.loop(
				Animated.sequence([
					Animated.timing(pulseAnim, {
						toValue: 1.5,
						duration: 1000,
						useNativeDriver: true,
					}),
					Animated.timing(pulseAnim, {
						toValue: 1,
						duration: 1000,
						useNativeDriver: true,
					}),
				])
			);
			animation.start();
		} else {
			pulseAnim.setValue(1);
		}

		return () => {
			if (animation) {
				animation.stop();
			}
		};
	}, [isRecording, pulseAnim]);

	useEffect(() => {
		let animation: Animated.CompositeAnimation;

		if (isPlaying) {
			animation = Animated.loop(
				Animated.sequence([
					Animated.timing(playingPulseAnim, {
						toValue: 1.5,
						duration: 1000,
						useNativeDriver: true,
					}),
					Animated.timing(playingPulseAnim, {
						toValue: 1,
						duration: 1000,
						useNativeDriver: true,
					}),
				])
			);
			animation.start();
		} else {
			playingPulseAnim.setValue(1);
		}

		return () => {
			if (animation) {
				animation.stop();
			}
		};
	}, [isPlaying, playingPulseAnim]);

	// Monitor player state
	useEffect(() => {
		if (audioSource && player.playing) {
			setIsPlaying(true);
		} else {
			setIsPlaying(false);
		}
	}, [audioSource, player.playing]);

	const requestMicrophonePermission = async () => {
		try {
			const { granted } = await AudioModule.requestRecordingPermissionsAsync();

			if (granted) {
				console.log("✅ Microphone permission granted");
				setHasPermission(true);
				return true;
			} else {
				console.log("❌ Microphone permission denied");
				Alert.alert(
					"Permission Denied",
					"Microphone permission is required to record voice messages.",
					[{ text: "OK" }]
				);
				return false;
			}
		} catch (err) {
			console.error("Permission error:", err);
			Alert.alert("Error", "Failed to request microphone permission");
			return false;
		}
	};

	const startRecording = async () => {
		try {
			console.log("🎤 Starting recording...");
			await audioRecorder.prepareToRecordAsync();

			await AudioModule.setAudioModeAsync({
				allowsRecording: true,
				playsInSilentMode: true,
			});
			audioRecorder.record();
			setIsRecording(true);
			setUserText("");
			setAiText("");
			console.log("✅ Recording started");
		} catch (err) {
			console.error("Failed to start recording:", err);
			Alert.alert("Error", "Failed to start recording");
		}
	};

	const speechToText = async (audioUri: string) => {
		try {
			const fileExtension = audioUri.split(".").pop()?.toLowerCase() || "m4a";

			const mimeTypes: Record<string, string> = {
				m4a: "audio/m4a",
				mp3: "audio/mpeg",
				wav: "audio/wav",
				mp4: "audio/mp4",
				webm: "audio/webm",
				ogg: "audio/ogg",
			};

			const mimeType = mimeTypes[fileExtension] || "audio/m4a";

			console.log("Audio URI:", audioUri);
			console.log("MIME type:", mimeType);

			const formData = new FormData();
			formData.append("file", {
				uri: audioUri,
				type: mimeType,
				name: `audio.${fileExtension}`,
			} as any);
			formData.append("model", "whisper-1");

			const result = await fetch(
				"https://api.openai.com/v1/audio/transcriptions",
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
					},
					body: formData,
				}
			);

			const responseText = await result.text();

			if (!result.ok) {
				throw new Error(`API error: ${result.status} - ${responseText}`);
			}

			const data = JSON.parse(responseText);
			return data.text;
		} catch (error) {
			console.error("Speech to text error:", error);
			throw error;
		}
	};

	const getChatResponse = async (userMessage: string) => {
		try {
			const response = await fetch(
				"https://api.openai.com/v1/chat/completions",
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						model: "gpt-4",
						messages: [
							{
								role: "system",
								content: "You are a helpful assistant.",
							},
							{
								role: "user",
								content: userMessage,
							},
						],
						temperature: 0.7,
					}),
				}
			);

			const responseText = await response.text();

			if (!response.ok) {
				throw new Error(`Chat API error: ${response.status} - ${responseText}`);
			}

			const data = JSON.parse(responseText);
			return data.choices[0].message.content;
		} catch (error) {
			console.error("Chat error:", error);
			throw error;
		}
	};

	const textToSpeech = async (text: string) => {
		try {
			const voiceId = "EXAVITQu4vr4xnSDxMaL";

			const response = await fetch(
				`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
				{
					method: "POST",
					headers: {
						Accept: "audio/mpeg",
						"Content-Type": "application/json",
						"xi-api-key": process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY!,
					},
					body: JSON.stringify({
						text: text,
						model_id: "eleven_monolingual_v1",
						voice_settings: {
							stability: 0.5,
							similarity_boost: 0.5,
						},
					}),
				}
			);

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`TTS API error: ${response.status} - ${errorText}`);
			}

			const arrayBuffer = await response.arrayBuffer();
			const base64Audio = btoa(
				new Uint8Array(arrayBuffer).reduce(
					(data, byte) => data + String.fromCharCode(byte),
					""
				)
			);

			return base64Audio;
		} catch (error) {
			console.error("Text to speech error:", error);
			throw error;
		}
	};

	const playAudio = async (audioBase64: string) => {
		try {
			console.log("🔊 Preparing to play audio...");

			// Save base64 audio to a temporary file
			const fileUri = `${
				FileSystem.cacheDirectory
			}temp_audio_${Date.now()}.mp3`;

			await FileSystem.writeAsStringAsync(fileUri, audioBase64, {
				encoding: FileSystem.EncodingType.Base64,
			});

			console.log("✅ Audio saved to:", fileUri);

			// Set audio mode for playback
			await setAudioModeAsync({
				playsInSilentMode: true,
				allowsRecording: false,
			});

			// Replace with file URI and play
			player.replace(fileUri);
			player.play();

			console.log("▶️ Audio playing");
		} catch (error) {
			console.error("Audio playback error:", error);
			Alert.alert("Error", "Failed to play audio");
			throw error;
		}
	};

	const stopRecording = async () => {
		try {
			console.log("⏹️ Stopping recording...");

			await audioRecorder.stop();
			const uri = audioRecorder.uri;

			console.log("✅ Recording stopped");
			setIsRecording(false);

			// Process voice conversation
			await processVoiceConversation(uri!);
		} catch (err) {
			console.error("Failed to stop recording:", err);
			Alert.alert("Error", "Failed to stop recording");
			setIsProcessing(false);
		}
	};

	const processVoiceConversation = async (audioUri: string) => {
		try {
			setIsProcessing(true);

			// Step 1: Convert speech to text
			console.log("Transcribing audio...");
			const transcribedText = await speechToText(audioUri);
			console.log("You said:", transcribedText);
			setUserText(transcribedText);

			// Step 2: Get AI response
			console.log("Getting AI response...");
			const aiResponse = await getChatResponse(transcribedText);
			console.log("AI says:", aiResponse);
			setAiText(aiResponse);

			// Step 3: Convert AI response to speech
			console.log("Converting to speech...");
			const audioBase64 = await textToSpeech(aiResponse);

			// Step 4: Play the audio
			console.log("Playing audio...");
			await playAudio(audioBase64);

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

	const handlePress = async () => {
		if (!hasPermission) {
			await requestMicrophonePermission();
			return;
		}

		setAudioModeAsync({
			playsInSilentMode: true,
			allowsRecording: true,
		});

		if (!isRecording && !isProcessing && !isPlaying) {
			await startRecording();
		} else if (isRecording) {
			await stopRecording();
		}
	};

	return (
		<View style={styles.container}>
			{isRecording && (
				<>
					<Animated.View
						style={[
							styles.pulseRing,
							{
								transform: [{ scale: pulseAnim }],
								opacity: pulseAnim.interpolate({
									inputRange: [1, 1.5],
									outputRange: [0.6, 0],
								}),
							},
						]}
					/>
					<Animated.View
						style={[
							styles.pulseRing,
							styles.pulseRingDelay,
							{
								transform: [
									{
										scale: pulseAnim.interpolate({
											inputRange: [1, 1.5],
											outputRange: [1.2, 1.8],
										}),
									},
								],
								opacity: pulseAnim.interpolate({
									inputRange: [1, 1.5],
									outputRange: [0.4, 0],
								}),
							},
						]}
					/>
				</>
			)}

			{isPlaying && (
				<>
					<Animated.View
						style={[
							styles.pulseRing,
							styles.playingPulseRing,
							{
								transform: [{ scale: playingPulseAnim }],
								opacity: playingPulseAnim.interpolate({
									inputRange: [1, 1.5],
									outputRange: [0.6, 0],
								}),
							},
						]}
					/>
					<Animated.View
						style={[
							styles.pulseRing,
							styles.pulseRingDelay,
							styles.playingPulseRing,
							{
								transform: [
									{
										scale: playingPulseAnim.interpolate({
											inputRange: [1, 1.5],
											outputRange: [1.2, 1.8],
										}),
									},
								],
								opacity: playingPulseAnim.interpolate({
									inputRange: [1, 1.5],
									outputRange: [0.4, 0],
								}),
							},
						]}
					/>
				</>
			)}

			<Animated.View
				style={[
					styles.voiceButtonWrapper,
					{
						transform: [{ scale: scaleAnim }],
					},
				]}
			>
				<TouchableOpacity
					style={[
						styles.voiceButton,
						isRecording && styles.voiceButtonRecording,
						isPlaying && styles.voiceButtonPlaying,
					]}
					activeOpacity={0.8}
					onPress={handlePress}
					disabled={isProcessing || isPlaying}
				></TouchableOpacity>
			</Animated.View>
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
	voiceButtonRecording: {
		backgroundColor: "#E53935",
	},
	pulseRingDelay: {
		backgroundColor: "#E53935",
	},
	pulseRing: {
		position: "absolute",
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: "#E53935",
		zIndex: 1,
	},
	voiceButtonContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
	playingPulseRing: {
		backgroundColor: "#4CAF50",
	},
	voiceButtonPlaying: {
		backgroundColor: "#4CAF50",
	},
	voiceButtonWrapper: {
		position: "relative",
		zIndex: 2,
	},
	voiceButton: {
		width: 156,
		height: 156,
		borderRadius: 78,
		backgroundColor: "blue",
		justifyContent: "center",
		alignItems: "center",
		display: "flex",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	micIcon: {
		fontSize: 24,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.7)",
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	permissionModal: {
		backgroundColor: "#202c33",
		borderRadius: 16,
		padding: 24,
		width: "100%",
		maxWidth: 340,
		alignItems: "center",
	},

	micIconLarge: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: "#2a3942",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 20,
	},
	micIconText: {
		fontSize: 40,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "600",
		color: "#e9edef",
		marginBottom: 12,
		textAlign: "center",
	},
	modalDescription: {
		fontSize: 14,
		color: "#8696a0",
		textAlign: "center",
		lineHeight: 20,
		marginBottom: 24,
	},
	modalButtons: {
		flexDirection: "row",
		gap: 12,
		width: "100%",
	},
	modalButton: {
		flex: 1,
		paddingVertical: 12,
		borderRadius: 8,
		alignItems: "center",
	},
	cancelButton: {
		backgroundColor: "#2a3942",
	},
	cancelButtonText: {
		color: "#8696a0",
		fontSize: 16,
		fontWeight: "500",
	},
	allowButton: {
		backgroundColor: "#25d366",
	},
	allowButtonText: {
		color: "#111b21",
		fontSize: 16,
		fontWeight: "600",
	},
});
