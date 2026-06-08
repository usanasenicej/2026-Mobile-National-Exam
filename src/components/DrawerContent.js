import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
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
      'Are you sure you want to clear all search history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            clearSearchHistory();
          },
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
        {/* ── Header Gradient ── */}
        <View style={styles.headerGradient}>
          <View style={styles.brandSection}>
            <View style={styles.brandIconWrapper}>
              <Ionicons name="book" size={36} color={COLORS.white} />
            </View>
            <Text style={styles.brandTitle}>LexiSearch</Text>
            <Text style={styles.brandTagline}>Your pocket dictionary</Text>
          </View>
          <View style={styles.headerDecoration} />
        </View>

        {/* ── Navigation ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>MENU</Text>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => props.navigation.navigate('Search')}
            accessibilityRole="button"
            accessibilityLabel="Go to Search screen"
          >
            <View style={styles.navIconWrapper}>
              <Ionicons name="search" size={18} color={COLORS.white} />
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
              <Ionicons name="time-outline" size={16} color="#94A3B8" />
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
                  accessibilityLabel="Clear search history"
                  accessibilityRole="button"
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
              <Ionicons name="time-outline" size={28} color="#94A3B8" />
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
                  accessibilityRole="button"
                  accessibilityLabel={`Search again for ${item}`}
                  activeOpacity={0.7}
                >
                  <View style={styles.historyItemIconWrapper}>
                    <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
                  </View>
                  <Text style={styles.historyItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </DrawerContentScrollView>

      {/* ── Footer ── */}
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

  // Header with gradient effect
  headerGradient: {
    backgroundColor: '#0F172A',
    paddingTop: 20,
    paddingBottom: 28,
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
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.drawerActive,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.drawerText,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  brandTagline: {
    fontSize: 13,
    color: '#94A3B8',
    fontStyle: 'italic',
    letterSpacing: 0.3,
  },
  headerDecoration: {
    position: 'absolute',
    bottom: -30,
    right: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.drawerActive,
    opacity: 0.15,
  },

  // Section
  section: {
    paddingHorizontal: 16,
    paddingTop: 18,
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
    backgroundColor: '#334155',
    marginHorizontal: 16,
    marginVertical: 8,
  },

  // Nav items
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    marginVertical: 2,
    borderWidth: 1,
    borderColor: '#334155',
  },
  navIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.drawerActive,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  navLabel: {
    flex: 1,
    fontSize: 15,
    color: COLORS.drawerText,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  navActiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },

  // History header
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
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  historyCountBadge: {
    backgroundColor: COLORS.drawerActive,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  historyCount: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  clearButton: {
    backgroundColor: 'rgba(248, 113, 113, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.3)',
  },
  clearButtonText: {
    color: '#F87171',
    fontSize: 12,
    fontWeight: '600',
  },

  // History item
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
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  historyItemIcon: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  historyItemText: {
    color: COLORS.drawerText,
    fontSize: 14,
    fontWeight: '500',
    flexShrink: 1,
    letterSpacing: 0.2,
    textTransform: 'capitalize',
  },

  // Empty state
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

  // Footer
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerDivider: {
    height: 1,
    backgroundColor: '#334155',
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
