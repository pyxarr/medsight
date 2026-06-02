import { useCallback, useEffect, useRef, useState } from 'react';
import { Image, ImageBackground, PanResponder, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const SLIDES = [
  {
    key: 'slide-1',
    image: require('@/assets/images/onboarding/onboarding-1.png'),
    text: 'Support tools and interpretable insights designed to assist informed breast health decision-making.',
  },
  {
    key: 'slide-2',
    image: require('@/assets/images/onboarding/onboarding-2.png'),
    text: 'A trusted space to learn, explore, and better understand breast health at your own pace.',
  },
] as const;

// Crossfade duration for image transition
const IMAGE_DURATION = 500;

// Fade duration for the text layer appearing
const TEXT_DURATION = 350;

// How fast each character is typed (ms per character)
const CHAR_INTERVAL = 25;

// How long to pause after typing finishes before auto-advancing
const POST_TYPE_DELAY = 1000;

export default function OnboardingSlides() {
  const router = useRouter();

  // Index of the image currently rendered on the top (visible) layer
  const [renderIndex, setRenderIndex] = useState(0);

  // Index of the image sitting on the bottom layer during crossfade
  // Stays as the last seen image to prevent a white flash while the top layer fades out
  const [prevIndex, setPrevIndex] = useState(0);

  // The text currently shown — grows one character at a time via the typewriter effect
  const [displayText, setDisplayText] = useState('');

  // UI-thread shared value tracking the current slide index
  // Used by panResponder to always read the real index without a stale JS closure
  const index = useSharedValue(0);

  // Drives the opacity of the top image layer for crossfade transitions
  const imageOpacity = useSharedValue(1);

  // Drives the opacity of the text — fades in after the image transition completes
  const textOpacity = useSharedValue(1);

  // UI-thread lock that prevents overlapping transitions
  // Only auto-advance is blocked — user swipes bypass this via goToRef
  const isAnimating = useSharedValue(false);

  // Ref holding the active typewriter interval so it can be cancelled mid-type
  const typingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Ref holding the post-type auto-advance timeout so it can be cancelled on swipe
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cancels both the typewriter interval and the auto-advance timeout
  // Called at the start of every transition to ensure a clean slate
  const clearTimers = useCallback(() => {
    if (typingRef.current) {
      clearInterval(typingRef.current);
      typingRef.current = null;
    }
    if (autoRef.current) {
      clearTimeout(autoRef.current);
      autoRef.current = null;
    }
  }, []);

  // Navigates to the next slide or exits to role-selection if past the last slide
  // Separated from goTo so startTyping can trigger it without a circular dependency
  const navigateNext = useCallback(
    (next: number) => {
      if (next >= SLIDES.length) {
        router.push('/onboarding/role-selection');
      } else {
        goToRef.current(next);
      }
    },
    [router]
  );

  // Starts the typewriter effect for the slide at index i
  // Resets displayText, types one character every CHAR_INTERVAL ms,
  // then waits POST_TYPE_DELAY before calling navigateNext
  const startTyping = useCallback(
    (i: number) => {
      clearTimers();

      let charIndex = 0;
      const text = SLIDES[i].text;

      setDisplayText('');

      typingRef.current = setInterval(() => {
        charIndex++;
        setDisplayText(text.slice(0, charIndex));

        if (charIndex >= text.length) {
          // Typing complete — clear the interval and schedule auto-advance
          clearTimers();
          autoRef.current = setTimeout(() => {
            navigateNext(i + 1);
          }, POST_TYPE_DELAY);
        }
      }, CHAR_INTERVAL);
    },
    [clearTimers, navigateNext]
  );

  // Stable ref to goTo — lets startTyping and panResponder call the latest
  // version of goTo without capturing a stale closure at creation time
  const goToRef = useRef<(n: number) => void>(() => { });

  // Drives the full slide transition sequence:
  // 1. Cancel any in-flight animations and timers
  // 2. Snapshot the current image as the bottom layer (prevents flash)
  // 3. Clear text before animation starts
  // 4. Fade top image out → swap to new image → fade in → fade text in → start typewriter
  const goTo = useCallback(
    (next: number) => {
      if (next < 0 || next >= SLIDES.length) return;

      // Block re-entry from auto-advance while a transition is in progress
      if (isAnimating.value) return;
      isAnimating.value = true;

      // Stop any running typewriter or auto-advance timer
      clearTimers();

      // Cancel any Reanimated animations still running on the UI thread
      cancelAnimation(imageOpacity);
      cancelAnimation(textOpacity);

      // Snapshot the current visible image as the bottom layer
      // so there's no white gap while the top layer fades out
      setPrevIndex(renderIndex);

      // Wipe the text before the animation begins to avoid the old text
      // flickering through on the new slide
      setDisplayText('');
      textOpacity.value = 0;

      // One frame delay lets React commit the cleared text before animating
      setTimeout(() => {
        // Fade top image out
        imageOpacity.value = withTiming(0, { duration: IMAGE_DURATION }, () => {
          // Swap the top layer to the new slide image
          index.value = next;
          runOnJS(setRenderIndex)(next);

          // Fade new image in
          imageOpacity.value = withTiming(1, { duration: IMAGE_DURATION }, () => {
            // Fade text layer in after image is fully visible
            textOpacity.value = withTiming(1, { duration: TEXT_DURATION }, () => {
              // Transition complete — unlock and start typing the new slide's text
              isAnimating.value = false;
              runOnJS(startTyping)(next);
            });
          });
        });
      }, 16);
    },
    [
      clearTimers,
      imageOpacity,
      index,
      isAnimating,
      renderIndex,
      startTyping,
      textOpacity,
    ]
  );

  // Keep the ref in sync with the latest goTo on every render
  goToRef.current = goTo;

  // On mount — start typing the first slide's text
  // Cleanup cancels all timers if the component unmounts mid-sequence
  useEffect(() => {
    startTyping(0);
    return clearTimers;
  }, [startTyping, clearTimers]);

  // Animated style for the top image layer — drives the crossfade
  const imageStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
  }));

  // Animated style for the text — fades in after image transition completes
  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  // Detects horizontal swipe gestures
  // Reads index.value (UI thread) instead of renderIndex (JS state) to avoid stale values
  // User swipes are not blocked by isAnimating — goTo handles the lock internally
  const panResponder = useRef(
    PanResponder.create({
      // Only claim the gesture if horizontal movement clearly dominates vertical
      onMoveShouldSetPanResponder: (_, { dx, dy }) =>
        Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10,
      onPanResponderRelease: (_, { dx }) => {
        if (dx < -40) {
          // Swipe left → advance to next slide
          goToRef.current(index.value + 1);
        } else if (dx > 40) {
          // Swipe right → go back to previous slide
          goToRef.current(index.value - 1);
        }
      },
    })
  ).current;

  return (
    <View style={{ flex: 1 }}>
      {/* Dual image layer — bottom holds the previous image, top fades in the new one
          This prevents any white flash during the crossfade transition */}
      <View style={{ position: 'absolute', inset: 0 }}>
        {/* Bottom layer — last seen image, static */}
        <ImageBackground
          source={SLIDES[prevIndex].image}
          resizeMode="cover"
          style={{ position: 'absolute', inset: 0 }}
        />

        {/* Top layer — new image, animates opacity during crossfade */}
        <Animated.View style={[{ position: 'absolute', inset: 0 }, imageStyle]}>
          <ImageBackground
            source={SLIDES[renderIndex].image}
            resizeMode="cover"
            style={{ flex: 1 }}
          />
        </Animated.View>
      </View>

      {/* UI shell — sits above both image layers, never participates in any animation */}
      <SafeAreaView
        style={{ flex: 1, justifyContent: 'space-between' }}
        {...panResponder.panHandlers}
      >
        {/* Logo — rendered once, never moves */}
        <View className="flex-row items-center gap-2.5 px-5 pt-2">
          <Image
            source={require('@/assets/images/logo-1.png')}
            className="w-9 h-9"
          />
          <Text className="text-white text-[17px] font-semibold">MedSight</Text>
        </View>

        {/* Bottom content — text and pagination dots */}
        <View className="px-6 pb-8 gap-6">
          {/* Typewriter text — fades in after image transition, then types character by character */}
          <Animated.Text
            style={[
              textStyle,
              {
                color: 'white',
                fontSize: 26,
                fontWeight: 'bold',
                lineHeight: 34,
                letterSpacing: -0.3,
              },
            ]}
          >
            {displayText}
          </Animated.Text>

          {/* Pagination dots — active dot is wider, never participate in transitions */}
          <View className="flex-row justify-center gap-1.5">
            {SLIDES.map((_, dotIndex) => (
              <View
                key={dotIndex}
                className={`h-2 rounded-xl ${renderIndex === dotIndex ? 'w-12 bg-white' : 'w-8 bg-white/35'
                  }`}
              />
            ))}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}