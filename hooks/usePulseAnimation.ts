import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export const usePulseAnimation = (isActive: boolean) => {
	const pulseAnim = useRef(new Animated.Value(1)).current;

	const startPulseAnimation = () => {
		const animation = Animated.loop(
			Animated.sequence([
				Animated.timing(pulseAnim, {
					toValue: 1.25,
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
		return animation;
	};

	useEffect(() => {
		let animation: Animated.CompositeAnimation | undefined;

		if (isActive) {
			animation = startPulseAnimation();
		} else {
			pulseAnim.setValue(1);
		}

		return () => {
			if (animation) {
				animation.stop();
			}
		};
	}, [isActive, pulseAnim]);

	return pulseAnim;
};
