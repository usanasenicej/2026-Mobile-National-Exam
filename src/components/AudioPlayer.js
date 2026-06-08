import React, { useState, useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { COLORS } from '../constants/colors';

const AudioPlayer = ({ audioUrls = [] }) => {
  const [audioStatus, setAudioStatus] = useState('idle');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const soundRef = useRef(null);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    };
  }, []);

  const validUrls = audioUrls.filter(
    (url) => url && typeof url === 'string' && url.trim().length > 0
  );

  if (validUrls.length === 0) return null;

  const uniqueUrls = [...new Set(validUrls)];

  const detectAccent = (url) => {
    const lower = url.toLowerCase();
    if (lower.includes('-us.') || lower.includes('/us/')) return 'US';
    if (lower.includes('-uk.') || lower.includes('/uk/') || lower.includes('-gb.') || lower.includes('/gb/')) return 'UK';
    if (lower.includes('-au.') || lower.includes('/au/')) return 'AU';
    if (lower.includes('-ca.') || lower.includes('/ca/')) return 'CA';
    if (lower.includes('-in.') || lower.includes('/in/')) return 'IN';
    return null;
  };

  const seenAccents = new Set();
  const displayUrls = uniqueUrls.filter((url) => {
    const accent = detectAccent(url);
    if (accent && seenAccents.has(accent)) return false;
    if (accent) seenAccents.add(accent);
    return true;
  });
  const displayCount = displayUrls.length;

  const multipleAudios = displayCount > 1;
  const canPlay = audioStatus !== 'playing' && audioStatus !== 'loading';
  const canPause = audioStatus === 'playing';
  const canStop = audioStatus !== 'idle' && audioStatus !== 'loading';

  const getAccentLabel = (url, idx) => {
    const detected = detectAccent(url);
    if (detected) return detected;
    return `${idx + 1}`;
  };

  const handlePlay = async () => {
    if (audioStatus === 'loading') return;

    if (audioStatus === 'paused') {
      if (soundRef.current) {
        try {
          await soundRef.current.playAsync();
          setAudioStatus('playing');
        } catch (_) {}
      } else {
        await loadAndPlay(displayUrls[selectedIndex]);
      }
      return;
    }

    if (audioStatus === 'playing') return;

    await loadAndPlay(displayUrls[selectedIndex]);
  };

  const loadAndPlay = async (url) => {
    setAudioStatus('loading');
    let loaded = false;

    if (soundRef.current) {
      await soundRef.current.unloadAsync().catch(() => {});
      soundRef.current = null;
    }

    try {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: false }
      );
      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          if (status.didJustFinish) {
            setAudioStatus('idle');
            sound.unloadAsync().catch(() => {});
            soundRef.current = null;
          }
        }
        if (status.error) {
          setAudioStatus('idle');
        }
      });

      await sound.playAsync();
      setAudioStatus('playing');
      loaded = true;
    } catch (err) {
      if (soundRef.current) {
        await soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    }

    if (!loaded) {
      setAudioStatus('idle');
      Alert.alert(
        'Playback Error',
        'Could not play the pronunciation audio. Please check your internet connection.',
        [{ text: 'OK' }]
      );
    }
  };

  const handlePause = async () => {
    if (audioStatus !== 'playing' || !soundRef.current) return;
    try {
      await soundRef.current.pauseAsync();
      setAudioStatus('paused');
    } catch (_) {}
  };

  const handleStop = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
      } catch (_) {}
      try {
        await soundRef.current.unloadAsync();
      } catch (_) {}
      soundRef.current = null;
    }
    setAudioStatus('idle');
  };

  const handleSelectAccent = async (index) => {
    setSelectedIndex(index);
    if (audioStatus === 'playing' || audioStatus === 'paused') {
      await handleStop();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Pronunciation</Text>

      {multipleAudios && (
        <View style={styles.accentRow}>
          {displayUrls.map((url, idx) => {
            const label = getAccentLabel(url, idx);
            const isActive = selectedIndex === idx;
            return (
              <TouchableOpacity
                key={`${url}-${idx}`}
                onPress={() => handleSelectAccent(idx)}
                style={[
                  styles.accentChip,
                  isActive && styles.accentChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.accentChipText,
                    isActive && styles.accentChipTextActive,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <View style={styles.transportRow}>
        <TouchableOpacity
          onPress={handlePlay}
          disabled={!canPlay}
          style={[
            styles.transportButton,
            styles.transportButtonPlay,
            !canPlay && styles.transportButtonDisabled,
          ]}
          accessibilityLabel="Play pronunciation"
          accessibilityRole="button"
        >
          {audioStatus === 'loading' ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Ionicons name="play" size={18} color={COLORS.white} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePause}
          disabled={!canPause}
          style={[
            styles.transportButton,
            styles.transportButtonPause,
            !canPause && styles.transportButtonDisabled,
          ]}
          accessibilityLabel="Pause pronunciation"
          accessibilityRole="button"
        >
          <Ionicons name="pause" size={18} color={COLORS.white} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleStop}
          disabled={!canStop}
          style={[
            styles.transportButton,
            styles.transportButtonStop,
            !canStop && styles.transportButtonDisabled,
          ]}
          accessibilityLabel="Stop pronunciation"
          accessibilityRole="button"
        >
          <Ionicons name="stop" size={18} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  accentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  accentChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginRight: 8,
    marginBottom: 6,
  },
  accentChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
  },
  accentChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  accentChipTextActive: {
    color: COLORS.white,
    fontWeight: '700',
  },
  transportRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transportButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  transportButtonPlay: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primaryDark,
  },
  transportButtonPause: {
    backgroundColor: COLORS.primaryDark,
    shadowColor: COLORS.primaryDark,
  },
  transportButtonStop: {
    backgroundColor: COLORS.errorRed,
    shadowColor: COLORS.errorRed,
  },
  transportButtonDisabled: {
    backgroundColor: COLORS.textMuted,
    shadowOpacity: 0,
    elevation: 0,
  },
});

export default AudioPlayer;
