import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withDelay,
  interpolate,
  Easing
} from "react-native-reanimated";

interface CommunityLoadingScreenProps {
  onAnimationComplete?: () => void;
}

export function CommunityLoadingScreen({ onAnimationComplete }: CommunityLoadingScreenProps) {
  const progress = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Pill loader animation: loops from 0 to 1
    progress.value = withRepeat(
      withTiming(1, { 
        duration: 1500, 
        easing: Easing.bezier(0.42, 0, 0.58, 1) 
      }),
      -1, 
      true
    );

    // Fade out the whole screen after a longer delay
    opacity.value = withDelay(
      3000, 
      withTiming(0, { duration: 1000 })
    );

    // Trigger the completion callback after the fade-out completes
    if (onAnimationComplete) {
      const timer = setTimeout(() => {
        onAnimationComplete();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [onAnimationComplete, progress, opacity]);

  const pillStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { 
          translateX: interpolate(
            progress.value, 
            [0, 1], 
            [0, 60] // Moves across the 60px wide pill
          ) 
        }
      ],
    };
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[styles.container, containerStyle]} pointerEvents="none">
      <View className="items-center justify-center">
        <Text style={styles.title}>Community</Text>
        
        {/* Pill Loader Container */}
        <View style={styles.pillContainer}>
          <Animated.View style={[styles.pillBar, pillStyle]} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#2563EB", // Matching the blue in the image
    zIndex: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  pillContainer: {
    width: 80,
    height: 16,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  pillBar: {
    width: 20,
    height: "100%",
    backgroundColor: "white",
    borderRadius: 8,
    position: "absolute",
  },
});
