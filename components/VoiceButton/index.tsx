// // // import { FC } from "react";
// // // import { Animated, Pressable, StyleSheet } from "react-native";

// // // interface VoiceButtonProps {
// // // 	scaleAnim: Animated.Value;
// // // 	isRecording: boolean;
// // // 	isPlaying: boolean;
// // // 	isProcessing: boolean;
// // // 	startRecording: () => void;
// // // 	stopRecording: () => void;
// // // }

// // // export const VoiceButton: FC<VoiceButtonProps> = ({
// // // 	scaleAnim,
// // // 	isRecording,
// // // 	isPlaying,
// // // 	isProcessing,
// // // 	startRecording,
// // // 	stopRecording,
// // // }) => {
// // // 	return (
// // // 		<Animated.View
// // // 			style={[
// // // 				styles.voiceButtonWrapper,
// // // 				{
// // // 					transform: [{ scale: scaleAnim }],
// // // 				},
// // // 			]}
// // // 		>
// // // 			<Pressable
// // // 				onPressIn={startRecording}
// // // 				onPressOut={stopRecording}
// // // 				style={({ pressed }) => [
// // // 					styles.recordButton,
// // // 					isRecording && styles.recordButtonActive,
// // // 					pressed && styles.recordButtonPressed,
// // // 				]}
// // // 			></Pressable>
// // // 		</Animated.View>
// // // 	);
// // // };

// // // const styles = StyleSheet.create({
// // // 	voiceButtonWrapper: {
// // // 		position: "relative",
// // // 		zIndex: 2,
// // // 	},
// // // 	voiceButton: {
// // // 		width: 156,
// // // 		height: 156,
// // // 		borderRadius: 78,
// // // 		backgroundColor: "blue",
// // // 		justifyContent: "center",
// // // 		alignItems: "center",
// // // 		display: "flex",
// // // 		shadowColor: "#000",
// // // 		shadowOffset: {
// // // 			width: 0,
// // // 			height: 2,
// // // 		},
// // // 		shadowOpacity: 0.25,
// // // 		shadowRadius: 3.84,
// // // 		elevation: 5,
// // // 	},
// // // 	voiceButtonRecording: {
// // // 		backgroundColor: "#E53935",
// // // 	},
// // // 	voiceButtonPlaying: {
// // // 		backgroundColor: "#4CAF50",
// // // 	},
// // // 	recordButton: {
// // // 		backgroundColor: "#007AFF",
// // // 		paddingVertical: 20,
// // // 		paddingHorizontal: 40,
// // // 		borderRadius: 50,
// // // 		minWidth: 200,
// // // 		alignItems: "center",
// // // 		elevation: 5,
// // // 		shadowColor: "#000",
// // // 		shadowOffset: { width: 0, height: 2 },
// // // 		shadowOpacity: 0.25,
// // // 		shadowRadius: 3.84,
// // // 	},
// // // 	recordButtonActive: {
// // // 		backgroundColor: "#FF3B30",
// // // 	},
// // // 	recordButtonPressed: {
// // // 		transform: [{ scale: 0.95 }],
// // // 	},
// // // });

// // import { FC } from "react";
// // import { Animated, Pressable, StyleSheet, Text } from "react-native";

// // interface VoiceButtonProps {
// // 	scaleAnim: Animated.Value;
// // 	isRecording: boolean;
// // 	isPlaying: boolean;
// // 	isProcessing: boolean;
// // 	startRecording: () => void;
// // 	stopRecording: () => void;
// // }

// // export const VoiceButton: FC<VoiceButtonProps> = ({
// // 	scaleAnim,
// // 	isRecording,
// // 	isPlaying,
// // 	isProcessing,
// // 	startRecording,
// // 	stopRecording,
// // }) => {
// // 	return (
// // 		<Animated.View
// // 			style={[
// // 				styles.voiceButtonWrapper,
// // 				{
// // 					transform: [{ scale: scaleAnim }],
// // 				},
// // 			]}
// // 		>
// // 			<Pressable
// // 				onPressIn={startRecording}
// // 				onPressOut={stopRecording}
// // 				disabled={isProcessing || isPlaying}
// // 				style={({ pressed }) => [
// // 					styles.recordButton,
// // 					isRecording && styles.recordButtonActive,
// // 					isPlaying && styles.recordButtonPlaying,
// // 					isProcessing && styles.recordButtonProcessing,
// // 					pressed && styles.recordButtonPressed,
// // 				]}
// // 			>
// // 				<Text style={styles.buttonText}>
// // 					{isProcessing
// // 						? "⏳ Processing..."
// // 						: isRecording
// // 						? "🎙️ Recording..."
// // 						: isPlaying
// // 						? "🔊 Playing"
// // 						: "🎤 Hold to Record"}
// // 				</Text>
// // 			</Pressable>
// // 		</Animated.View>
// // 	);
// // };

// // const styles = StyleSheet.create({
// // 	voiceButtonWrapper: {
// // 		position: "relative",
// // 		zIndex: 2,
// // 	},
// // 	recordButton: {
// // 		backgroundColor: "#007AFF",
// // 		paddingVertical: 20,
// // 		paddingHorizontal: 40,
// // 		borderRadius: 50,
// // 		minWidth: 200,
// // 		minHeight: 70,
// // 		justifyContent: "center",
// // 		alignItems: "center",
// // 		elevation: 5,
// // 		shadowColor: "#000",
// // 		shadowOffset: { width: 0, height: 2 },
// // 		shadowOpacity: 0.25,
// // 		shadowRadius: 3.84,
// // 	},
// // 	recordButtonActive: {
// // 		backgroundColor: "#FF3B30",
// // 	},
// // 	recordButtonPlaying: {
// // 		backgroundColor: "#4CAF50",
// // 	},
// // 	recordButtonProcessing: {
// // 		backgroundColor: "#FFA726",
// // 		opacity: 0.7,
// // 	},
// // 	recordButtonPressed: {
// // 		transform: [{ scale: 0.95 }],
// // 	},
// // 	buttonText: {
// // 		color: "white",
// // 		fontSize: 18,
// // 		fontWeight: "bold",
// // 		textAlign: "center",
// // 	},
// // });

// import { FC } from "react";
// import { Animated, Pressable, StyleSheet } from "react-native";

// interface VoiceButtonProps {
// 	scaleAnim: Animated.Value;
// 	isRecording: boolean;
// 	isPlaying: boolean;
// 	isProcessing: boolean;
// 	startRecording: () => Promise<void>;
// 	stopRecording: () => Promise<string | null>;
// }

// // stopRecording: () => Promise<void>;
// export const VoiceButton: FC<VoiceButtonProps> = ({
// 	scaleAnim,
// 	isRecording,
// 	isPlaying,
// 	isProcessing,
// 	startRecording,
// 	stopRecording,
// }) => {
// 	const handlePressIn = async () => {
// 		if (!isProcessing && !isPlaying) {
// 			await startRecording();
// 		}
// 	};

// 	const handlePressOut = async () => {
// 		if (isRecording) {
// 			await stopRecording();
// 		}
// 	};

// 	return (
// 		<Animated.View
// 			style={[
// 				styles.voiceButtonWrapper,
// 				{
// 					transform: [{ scale: scaleAnim }],
// 				},
// 			]}
// 		>
// 			<Pressable
// 				onPressIn={handlePressIn}
// 				onPressOut={handlePressOut}
// 				disabled={isProcessing || isPlaying}
// 				style={({ pressed }) => [
// 					styles.recordButton,
// 					isRecording && styles.recordButtonActive,
// 					isPlaying && styles.recordButtonPlaying,
// 					isProcessing && styles.recordButtonProcessing,
// 					pressed && styles.recordButtonPressed,
// 				]}
// 			></Pressable>
// 		</Animated.View>
// 	);
// };

// const styles = StyleSheet.create({
// 	voiceButtonWrapper: {
// 		position: "relative",
// 		zIndex: 2,
// 	},
// 	recordButton: {
// 		backgroundColor: "#007AFF",
// 		paddingVertical: 20,
// 		paddingHorizontal: 40,
// 		borderRadius: 100,
// 		minWidth: 150,
// 		minHeight: 150,
// 		justifyContent: "center",
// 		alignItems: "center",
// 		elevation: 5,
// 		shadowColor: "#000",
// 		shadowOffset: { width: 0, height: 2 },
// 		shadowOpacity: 0.25,
// 		shadowRadius: 3.84,
// 	},
// 	recordButtonActive: {
// 		backgroundColor: "#FF3B30",
// 	},
// 	recordButtonPlaying: {
// 		backgroundColor: "#4CAF50",
// 	},
// 	recordButtonProcessing: {
// 		backgroundColor: "#FFA726",
// 		opacity: 0.7,
// 	},
// 	recordButtonPressed: {
// 		transform: [{ scale: 0.95 }],
// 	},
// 	buttonText: {
// 		color: "white",
// 		fontSize: 18,
// 		fontWeight: "bold",
// 		textAlign: "center",
// 	},
// });

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
