import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');
const IMAGE_HEIGHT = height * 0.6;

export const styles = StyleSheet.create({
  slide: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: IMAGE_HEIGHT,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  logo: {
    marginTop: 50,
    width: 120,
    height: 120,
    resizeMode: 'contain',
    position: 'absolute',
    top: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  slideTitle: {
    fontSize: 20,
    color: '#1D1D1B',
    textAlign: 'left',
    marginBottom: 5,
    marginTop: 50,
    fontFamily: 'Verdana',
  },
  slideDescription: {
    fontSize: 25,
    marginBottom: 20,
    color: '#004854',
    fontFamily: 'Verdana',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonBase: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  arrowButton: {
    backgroundColor: '#005C6D',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4, // Android sombra
    shadowColor: '#000', // iOS sombra
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  backButton: {
    borderWidth: 1,
    borderColor: '#005C6D',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  backButtonText: {
    color: '#004854',
    fontSize: 16,
  },
  playButton: {
    paddingVertical: 14,
    backgroundColor: '#005C6D',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    width: 280,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    position: 'absolute',
    bottom: 80,
  },
  playButtonText: {
    color: '#ffffffff',
    fontSize: 22,
    fontWeight: '600',
  },
  finalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    backgroundColor: '#D9D9D9',
    width: 8,
    height: 8,
    borderRadius: 80,
    marginHorizontal: 4,
    opacity: 0.5,
  },
  activeDot: {
    backgroundColor: '#B20000',
    width: 12,
    height: 12,
    borderRadius: 80,
    marginHorizontal: 4,
    opacity: 1,
  },
  pagination: {
    position: 'absolute',
    bottom: 340,
    alignSelf: 'center',
  },
});
