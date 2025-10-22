import { AudioModule, RecordingPresets, useAudioRecorder } from "expo-audio";
import { useState } from "react";
import { Alert } from "react-native";

export const useVoiceRecording = () => {
	const [hasPermission, setHasPermission] = useState(false);
	const [isRecording, setIsRecording] = useState(false);
	const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

	const requestMicrophonePermission = async () => {
		try {
			const { granted } = await AudioModule.requestRecordingPermissionsAsync();

			if (granted) {
				setHasPermission(true);
				return true;
			} else {
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
			await audioRecorder.prepareToRecordAsync();
			await AudioModule.setAudioModeAsync({
				allowsRecording: true,
				playsInSilentMode: true,
			});
			audioRecorder.record();
			setIsRecording(true);
		} catch (err) {
			console.error("Failed to start recording:", err);
			Alert.alert("Error", "Failed to start recording");
		}
	};

	const stopRecording = async () => {
		try {
			await audioRecorder.stop();
			const uri = audioRecorder.uri;
			setIsRecording(false);
			return uri;
		} catch (err) {
			console.error("Failed to stop recording:", err);
			Alert.alert(
				"Recording Issue",
				"Oops! Something went wrong while stopping the recording. Please try again."
			);
		}
	};

	return {
		hasPermission,
		isRecording,
		audioRecorder,
		requestMicrophonePermission,
		startRecording,
		stopRecording,
		setIsRecording,
	};
};
