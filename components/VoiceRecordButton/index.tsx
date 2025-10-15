import { AudioModule } from "expo-audio";
import React, { useRef, useState } from "react";
import {
	Alert,
	Animated,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";

const VoiceRecordButton = () => {
	const scaleAnim = useRef(new Animated.Value(1)).current;

	const [hasPermission, setHasPermission] = useState(false);

	const requestMicrophonePermission = async () => {
		try {
			const { granted } = await AudioModule.requestRecordingPermissionsAsync();

			if (granted) {
				console.log("✅ Microphone permission granted");
				setHasPermission(true);
				// await startRecording();
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

	const handlePress = async () => {
		if (!hasPermission) {
			await requestMicrophonePermission();
			return;
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.voiceButtonContainer}>
				<Animated.View
					style={[
						styles.voiceButtonWrapper,
						{ transform: [{ scale: scaleAnim }] },
					]}
				>
					<TouchableOpacity
						style={styles.voiceButton}
						activeOpacity={0.8}
						onPress={handlePress}
					>
						{/* Your content here */}
					</TouchableOpacity>
				</Animated.View>
			</View>
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
	voiceButtonContainer: {
		justifyContent: "center",
		alignItems: "center",
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
