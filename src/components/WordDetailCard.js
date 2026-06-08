import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../constants/colors';
import AudioPlayer from './AudioPlayer';

const WordDetailCard = ({ data, word }) => {
  if (!data || data.length === 0) return null;

  const primaryEntry = data[0];
  const mainWord = primaryEntry.word || word;
  const allPhonetics = data.flatMap((entry) => entry.phonetics || []);
  const phoneticText =
    allPhonetics.find((p) => p.text)?.text ||
    primaryEntry.phonetic ||
    null;
  const audioUrls = allPhonetics
    .map((p) => p.audio)
    .filter((url) => url && url.trim() !== '');
  const allMeanings = data.flatMap((entry) => entry.meanings || []);

  return (
    <ScrollView
      style={styles.card}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Word Heading ── */}
      <View style={styles.wordHeader}>
        <View style={styles.wordTitleRow}>
          <View style={styles.wordTitleFlex}>
            <Text style={styles.wordText}>{mainWord}</Text>
            {phoneticText ? (
              <Text style={styles.phoneticText}>{phoneticText}</Text>
            ) : null}
          </View>
          {audioUrls.length > 0 && (
            <View style={styles.audioWrapper}>
              <AudioPlayer audioUrls={audioUrls} />
            </View>
          )}
        </View>
      </View>

      {/* Divider with gradient-like effect */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerDot} />
        <View style={styles.dividerLine} />
        <View style={styles.dividerDot} />
      </View>

      {/* ── Meanings ── */}
      {allMeanings.length === 0 ? (
        <Text style={styles.noDataText}>No meanings available for this word.</Text>
      ) : (
        allMeanings.map((meaning, mIdx) => (
          <MeaningSection key={mIdx} meaning={meaning} index={mIdx} total={allMeanings.length} />
        ))
      )}

      {/* Footer */}
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
            <Text style={styles.synonymIcon}>↔</Text>
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
            <Text style={styles.antonymIcon}>⇄</Text>
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
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    elevation: 6,
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    maxHeight: '75%',
  },

  // Word header
  wordHeader: {
    marginBottom: 8,
  },
  wordTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wordTitleFlex: {
    flex: 1,
    flexShrink: 1,
  },
  wordText: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textPrimary,
    lineHeight: 34,
  },
  phoneticText: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: '500',
    marginTop: 4,
    fontStyle: 'italic',
  },
  audioWrapper: {
    marginLeft: 12,
  },

  // Divider row
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  dividerLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: COLORS.border,
    marginHorizontal: 10,
  },

  // Meaning block
  meaningBlock: {
    marginBottom: 4,
  },
  meaningBlockSpacer: {
    marginTop: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  posHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  posBadgeWrapper: {
    flex: 1,
  },
  posBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    elevation: 1,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  posText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  posCount: {
    marginLeft: 10,
    justifyContent: 'flex-end',
  },
  posCountText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
  },

  // Definition
  defItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  defNumberWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
    flexShrink: 0,
  },
  defNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  defContent: {
    flex: 1,
  },
  defText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    lineHeight: 22,
    fontWeight: '500',
  },
  exampleBox: {
    backgroundColor: COLORS.secondary,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 8,
  },
  exampleQuote: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    lineHeight: 20,
  },

  // Synonyms / Antonyms
  synonymSection: {
    marginTop: 12,
  },
  synonymLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  synonymIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.successGreen,
    marginRight: 4,
  },
  synonymLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.successGreen,
  },
  antonymLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 4,
  },
  antonymIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.accent,
    marginRight: 4,
  },
  antonymLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.accent,
  },
  synonymChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  chip: {
    backgroundColor: COLORS.secondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    margin: 2,
  },
  chipText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  antonymChip: {
    backgroundColor: COLORS.accentLight,
    borderColor: '#FED7AA',
  },
  antonymChipText: {
    color: COLORS.accent,
  },

  noDataText: {
    color: COLORS.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 16,
    fontSize: 15,
  },

  cardFooter: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
});

export default WordDetailCard;
