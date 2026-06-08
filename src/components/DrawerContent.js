import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useDictionary } from '../context/DictionaryContext';
import { COLORS } from '../constants/colors';

const DrawerContent = (props) => {
  const { searchHistory, searchWord, clearSearchHistory } = useDictionary();

  const handleHistoryPress = (word) => {
    props.navigation.closeDrawer();
    setTimeout(() => {
      searchWord(word);
    }, 300);
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear Search History',
      'Are you sure you want to clear all search history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: clearSearchHistory,
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Header ── */}
        <View style={styles.headerGradient}>
          <View style={styles.brandSection}>
            <View style={styles.brandIconWrapper}>
              <Ionicons name="book" size={32} color={COLORS.accent} />
            </View>
            <Text style={styles.brandTitle}>LexiSearch</Text>
            <Text style={styles.brandTagline}>Your Premium Dictionary</Text>
          </View>
          <View style={styles.headerDecoration} />
        </View>

        {/* ── Nav ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>MENU</Text>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => props.navigation.navigate('Search')}
            accessibilityRole="button"
          >
            <View style={styles.navIconWrapper}>
              <Ionicons name="search" size={18} color={COLORS.primaryDark} />
            </View>
            <Text style={styles.navLabel}>Search Words</Text>
            <View style={styles.navActiveDot} />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* ── Search History ── */}
        <View style={styles.section}>
          <View style={styles.historyHeader}>
            <View style={styles.historyTitleRow}>
              <Ionicons name="time-outline" size={16} color={COLORS.accent} />
              <Text style={styles.historyTitle}>Recent Searches</Text>
            </View>
            <View style={styles.historyHeaderRight}>
              {searchHistory.length > 0 && (
                <View style={styles.historyCountBadge}>
                  <Text style={styles.historyCount}>{searchHistory.length}</Text>
                </View>
              )}
              {searchHistory.length > 0 && (
                <TouchableOpacity
                  onPress={handleClearHistory}
                  style={styles.clearButton}
                >
                  <Text style={styles.clearButtonText}>Clear All</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {searchHistory.length === 0 ? (
            <View style={styles.emptyHistory}>
              <View style={styles.emptyIconWrapper}>
                <Ionicons name="time-outline" size={28} color="#64748B" />
              </View>
              <Text style={styles.emptyHistoryText}>No searches yet</Text>
              <Text style={styles.emptyHistoryHint}>
                Words you look up will appear here for quick access.
              </Text>
            </View>
          ) : (
            <FlatList
              data={searchHistory}
              keyExtractor={(item, index) => `hist-${item}-${index}`}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.historyItem}
                  onPress={() => handleHistoryPress(item)}
                  accessibilityLabel={`Search again for ${item}`}
                >
                  <View style={styles.historyItemIconWrapper}>
                    <Ionicons name="chevron-forward" size={16} color={COLORS.accent} />
                  </View>
                  <Text style={styles.historyItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </DrawerContentScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerDivider} />
        <Text style={styles.footerText}>Powered by Free Dictionary API</Text>
        <Text style={styles.footerCopyright}>© 2026 LexiTech Solutions Ltd</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.drawerBg,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  headerGradient: {
    backgroundColor: '#0F172A',
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  brandSection: {
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
  },
  brandIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.drawerText,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  brandTagline: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  headerDecoration: {
    position: 'absolute',
    bottom: -30,
    right: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.drawerActive,
    opacity: 0.08,
  },

  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 1.5,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#1E293B',
    marginHorizontal: 16,
    marginVertical: 8,
  },

  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#1E293B',
    marginVertical: 2,
    borderWidth: 1,
    borderColor: '#334155',
  },
  navIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  navLabel: {
    flex: 1,
    fontSize: 15,
    color: COLORS.drawerText,
    fontWeight: '600',
  },
  navActiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },

  profileCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  profileAvatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.accent,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.drawerText,
    marginBottom: 3,
  },
  profileFrequencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileFrequency: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: '500',
    marginLeft: 4,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
  },
  editProfileText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.accent,
    marginLeft: 4,
  },

  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 10,
  },
  historyHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  historyCountBadge: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  historyCount: {
    color: COLORS.primaryDark,
    fontSize: 12,
    fontWeight: '700',
  },
  clearButton: {
    backgroundColor: 'rgba(220, 38, 38, 0.12)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.25)',
  },
  clearButtonText: {
    color: '#FCA5A5',
    fontSize: 12,
    fontWeight: '600',
  },

  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginHorizontal: 8,
    marginVertical: 3,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  historyItemIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  historyItemText: {
    color: COLORS.drawerText,
    fontSize: 14,
    fontWeight: '500',
    flexShrink: 1,
    letterSpacing: 0.2,
    textTransform: 'capitalize',
  },

  emptyHistory: {
    paddingHorizontal: 20,
    paddingVertical: 28,
    alignItems: 'center',
  },
  emptyIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyHistoryText: {
    color: COLORS.drawerText,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptyHistoryHint: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },

  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerDivider: {
    height: 1,
    backgroundColor: '#1E293B',
    marginBottom: 12,
  },
  footerText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '500',
  },
  footerCopyright: {
    color: '#475569',
    fontSize: 10,
    marginTop: 4,
  },
});

export default DrawerContent;
