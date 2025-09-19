

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F8F7',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Espaço para a navegação inferior
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#B2EBF2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F7FA',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    marginLeft: 5,
    color: '#004A5A',
    fontWeight: 'bold',
  },
  optionsCard: {
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
    marginTop: 20,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#DDDDDD',
    marginHorizontal: 20,
  },
  rankingSection: {
    marginTop: 30,
  },
  rankingTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00839A',
  },
  rankingDescription: {
    fontSize: 15,
    color: '#585858',
    marginTop: 10,
    lineHeight: 22,
  },
  rankingList: {
    marginTop: 20,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  rankingNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#004A5A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  rankingNumberText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  rankingItemText: {
    fontSize: 18,
    color: '#333',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginTop: 30,
    height: 300,
  },
  chartBarWrapper: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '30%',
    height: '100%',
  },
  chartBar: {
    width: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingTop: 20, // Espaço para o círculo do ranking
  },
  barOne: {
    backgroundColor: '#00839A',
    height: '90%', // 80 Acertos (mais alto)
  },
  barTwo: {
    backgroundColor: '#B2EBF2',
    height: '75%', // 70 Acertos (médio)
  },
  barThree: {
    backgroundColor: '#D1E3E6',
    height: '65%', // 65 Acertos (mais baixo)
  },
  chartRankCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -16, // Metade para fora
    borderWidth: 3,
    borderColor: '#F4F8F7',
  },
  rankCircleOne: {
    backgroundColor: '#00839A',
  },
  rankCircleTwo: {
    backgroundColor: '#B2EBF2',
  },
  rankCircleThree: {
    backgroundColor: '#D1E3E6',
  },
  chartRankText: {
    color: '#004A5A',
    fontWeight: 'bold',
    fontSize: 16,
  },
  chartAcertosValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004A5A',
  },
  chartAcertosLabel: {
    fontSize: 16,
    color: '#004A5A',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#585858',
    marginTop: 4,
  },
  navTextActive: {
    color: '#00839A',
  },
});

export default styles;