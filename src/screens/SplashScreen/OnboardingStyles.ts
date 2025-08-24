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
    fontSize: 18,
    color: '#1D1D1B',
    textAlign: 'left',
    marginBottom: 5,
    marginTop: 50,
    fontFamily: 'Verdana',
  },
  slideDescription: {
    fontSize: 25,
    marginBottom: 20,
    fontWeight: '600',
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
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginLeft: 10,
  },
  arrowButton: {
    backgroundColor: '#005C6D',
   
  },
  backButton: {
    borderWidth: 1,
    borderColor: '#005C6D',
  },
  backButtonText: {
    color: '#004854',
    fontSize: 16,
  },
  playButton: {
    paddingVertical: 10,
    backgroundColor: '#005C6D',
    alignItems: 'center',
    borderRadius: 100,
    width:300,
    bottom: 40,
  },
  playButtonText: {
    color: '#ffffffff',
    fontSize: 22,
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
  },
  activeDot: {
    backgroundColor: '#B20000',
    width: 10,
    height: 10,
    borderRadius: 80,
    marginHorizontal: 4,
  },
  pagination: {
    position: 'absolute',
    gap: 8,
    bottom: 340,
  },
});
