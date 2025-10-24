import React, { FC } from "react";
import { Animated, StyleSheet } from "react-native";

interface PulseRingProps {
	pulseAnim: Animated.Value;
	isPlaying?: boolean;
}

export const PulseRing: FC<PulseRingProps> = ({ pulseAnim, isPlaying }) => {
	return (
		<>
			<Animated.View
				style={[
					styles.pulseRing,
					isPlaying && styles.playingPulseRing,
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
					isPlaying && styles.playingPulseRing,
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
	);
};

const styles = StyleSheet.create({
	pulseRing: {
		position: "absolute",
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: "red",
		zIndex: 1,
	},
	pulseRingDelay: {
		backgroundColor: "red",
	},
	playingPulseRing: {
		backgroundColor: "#4CAF50",
	},
});
