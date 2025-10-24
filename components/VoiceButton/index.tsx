import React from "react";
import { Animated, Pressable, StyleSheet } from "react-native";

interface VoiceButtonProps {
	scaleAnim: Animated.Value;
	isRecording: boolean;
	isPlaying: boolean;
	isProcessing: boolean;
	onPressIn: () => void;
	onPressOut: () => void;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
	scaleAnim,
	isRecording,
	isPlaying,
	isProcessing,
	onPressIn,
	onPressOut,
}) => {
	return (
		<Animated.View
			style={[
				styles.voiceButtonWrapper,
				{
					transform: [{ scale: scaleAnim }],
				},
			]}
		>
			<Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
				<Animated.View
					style={[
						styles.voiceButton,
						isRecording && styles.voiceButtonRecording,
						isPlaying && styles.voiceButtonPlaying,
						(isProcessing || isPlaying) && styles.voiceButtonDisabled,
					]}
				></Animated.View>
			</Pressable>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
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
	voiceButtonRecording: {
		backgroundColor: "#E53935",
	},
	voiceButtonPlaying: {
		backgroundColor: "#4CAF50",
	},
	voiceButtonDisabled: {
		opacity: 0.5,
	},
	recordingText: {
		color: "#fff",
		fontSize: 14,
		fontWeight: "600",
	},
});
