import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    paddingTop: 70,
  },
  title: {
    color: '#005C6D',
    fontSize: 28,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 24,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  topButtons: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#005c6dff',
    borderWidth: 1.5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  secondaryButtonText: {
    color: '#005C6D',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
  phaseMapContainer: {
    marginTop: 10,
  },
  phaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  verticalLine: {
    position: 'absolute',
    left: 59,
    top: -40,
    width: 5,
    height: 40,
    backgroundColor: '#979797ff',
  },
  phaseCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  phaseNumber: {
    fontSize: 45,
    fontWeight: '300',
  },
  lockIcon: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  phaseInfo: {
    marginLeft: 20,
  },
  subjectTitle: {
    fontSize: 30,
    fontWeight: '400',
  },
  completedText: {
    fontSize: 16,
    color: '#016273ff',
    fontWeight: '600',
    marginTop: 2,
  },
});
