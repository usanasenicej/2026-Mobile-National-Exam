import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import AudioPlayer from './AudioPlayer';

const WordDetailCard = ({ data, word }) => {
  if (!data || data.length === 0) return null;

  const primaryEntry = data[0];
  const mainWord = primaryEntry.word || word;
  const allPhonetics = data.flatMap((entry) => entry.phonetics || []);
  const allMeanings = data.flatMap((entry) => entry.meanings || []);

  const defaultPhonetic =
    allPhonetics.find((p) => p.text)?.text ||
    primaryEntry.phonetic ||
    null;

  const [selectedPhonetic, setSelectedPhonetic] = useState({
    text: defaultPhonetic,
    audio: allPhonetics.find((p) => p.text === defaultPhonetic)?.audio || null
  });

  const audioUrls = allPhonetics
    .map((p) => ({ audio: p.audio, text: p.text }))
    .filter((item) => item.audio && item.audio.trim() !== '');

  const handleAccentSelect = (audioUrl, phoneticText) => {
    setSelectedPhonetic({ 
      text: phoneticText || allPhonetics.find((p) => p.audio === audioUrl)?.text || null, 
      audio: audioUrl 
    });
  };

  return (
    <ScrollView
      style={styles.card}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Word Heading ── */}
      <View style={styles.wordHeader}>
        <Text style={styles.wordText}>{mainWord}</Text>
        {selectedPhonetic.text ? (
          <Text style={styles.phoneticText}>{selectedPhonetic.text}</Text>
        ) : null}
        {audioUrls.length > 0 && (
          <View style={styles.audioWrapper}>
            <AudioPlayer 
              audioUrls={audioUrls.map((u) => u.audio)} 
              phonetics={allPhonetics}
              onAccentSelect={handleAccentSelect} 
            />
          </View>
        )}
      </View>

      <View style={styles.divider} />

      {/* ── Meanings ── */}
      {allMeanings.length === 0 ? (
        <Text style={styles.noDataText}>No meanings available for this word.</Text>
      ) : (
        allMeanings.map((meaning, mIdx) => (
          <MeaningSection key={mIdx} meaning={meaning} index={mIdx} total={allMeanings.length} />
        ))
      )}

      <View style={styles.cardFooter}>
        <Text style={styles.footerText}>Powered by Free Dictionary API</Text>
      </View>
    </ScrollView>
  );
};

const MeaningSection = ({ meaning, index, total }) => {
  if (!meaning) return null;
  const { partOfSpeech, definitions = [], synonyms = [], antonyms = [] } = meaning;
  const isLast = index === total - 1;

  return (
    <View style={[styles.meaningBlock, !isLast && styles.meaningBlockSpacer]}>
      {/* Part of speech header */}
      <View style={styles.posHeader}>
        <View style={styles.posBadgeWrapper}>
          <View style={styles.posBadge}>
            <Text style={styles.posText}>{partOfSpeech}</Text>
          </View>
        </View>
        <View style={styles.posCount}>
          <Text style={styles.posCountText}>{definitions.length} definition{definitions.length !== 1 ? 's' : ''}</Text>
        </View>
      </View>

      {/* Definitions */}
      {definitions.map((def, dIdx) => (
        <DefinitionItem key={dIdx} definition={def} number={dIdx + 1} />
      ))}

      {/* Synonyms */}
      {synonyms.length > 0 && (
        <View style={styles.synonymSection}>
          <View style={styles.synonymLabelRow}>
            <Ionicons name="swap-horizontal" size={14} color={COLORS.successGreen} />
            <Text style={styles.synonymLabel}>Synonyms</Text>
          </View>
          <View style={styles.synonymChips}>
            {synonyms.slice(0, 8).map((syn, i) => (
              <View key={i} style={styles.chip}>
                <Text style={styles.chipText}>{syn}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Antonyms */}
      {antonyms.length > 0 && (
        <View style={styles.synonymSection}>
          <View style={styles.antonymLabelRow}>
            <Ionicons name="swap-horizontal" size={14} color={COLORS.accent} />
            <Text style={styles.antonymLabel}>Antonyms</Text>
          </View>
          <View style={styles.synonymChips}>
            {antonyms.slice(0, 8).map((ant, i) => (
              <View key={i} style={[styles.chip, styles.antonymChip]}>
                <Text style={[styles.chipText, styles.antonymChipText]}>{ant}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const DefinitionItem = ({ definition, number }) => {
  if (!definition) return null;
  const { definition: defText, example } = definition;

  return (
    <View style={styles.defItem}>
      <View style={styles.defNumberWrapper}>
        <Text style={styles.defNumber}>{number}</Text>
      </View>
      <View style={styles.defContent}>
        <Text style={styles.defText}>{defText}</Text>
        {example ? (
          <View style={styles.exampleBox}>
            <Text style={styles.exampleQuote}>"{example}"</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 24,
    padding: 28,
    marginTop: 16,
    elevation: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    maxHeight: '72%',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },

  wordHeader: {
    marginBottom: 16,
  },
  wordText: {
    fontSize: 34,
    fontWeight: '800',
    color: COLORS.textPrimary,
    lineHeight: 40,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  phoneticText: {
    fontSize: 17,
    color: COLORS.phonetic,
    fontWeight: '500',
    fontStyle: 'italic',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  audioWrapper: {
    marginTop: 8,
  },

  divider: {
    height: 2,
    backgroundColor: COLORS.border,
    marginVertical: 18,
    borderRadius: 1,
  },

  meaningBlock: {
    marginBottom: 8,
  },
  meaningBlockSpacer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  posHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  posBadgeWrapper: {
    flex: 1,
  },
  posBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    elevation: 2,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  posText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  posCount: {
    marginLeft: 12,
    justifyContent: 'flex-end',
  },
  posCountText: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '600',
  },

  defItem: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'flex-start',
  },
  defNumberWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
    flexShrink: 0,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  defNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.accentDark,
  },
  defContent: {
    flex: 1,
  },
  defText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    lineHeight: 24,
    fontWeight: '500',
  },
  exampleBox: {
    backgroundColor: COLORS.accentLight,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 10,
  },
  exampleQuote: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    lineHeight: 21,
  },

  synonymSection: {
    marginTop: 14,
  },
  synonymLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  synonymLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.successGreen,
    marginLeft: 4,
    letterSpacing: 0.3,
  },
  antonymLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
  antonymLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.accent,
    marginLeft: 4,
    letterSpacing: 0.3,
  },
  synonymChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 3,
  },
  chipText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  antonymChip: {
    backgroundColor: COLORS.accentLight,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  antonymChipText: {
    color: COLORS.accentDark,
  },

  noDataText: {
    color: COLORS.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
  },

  cardFooter: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});

export default WordDetailCard;
