import { StyleSheet } from 'react-native';

export const footer = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: '#EAEFF1',
        borderTopWidth: 1,
        borderTopColor: '#EAEFF1',
    },
    iconContainer: {
        flex: 1,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        fontFamily: 'Roboto_400Regular',
    }
});

export const timeModal = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContainer: {
        backgroundColor: '#f7f8fa',
        borderRadius: 16,
        borderColor: '#619B8A',
        borderWidth: 3,
        padding: 24,
        width: 300,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '300',
        marginBottom: 18,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 16,
        width: 100,
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 8,
        padding: 4,
        color: '#f7f8fa'
    },
    label: {
        fontSize: 18,
        fontWeight: '300',
        marginBottom: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    activateButton: {
        backgroundColor: '#619B8A',
        paddingVertical: 6,
        paddingHorizontal: 6,
        borderRadius: 16,
        marginRight: 14,
        minWidth: 80,
        alignItems: 'center',
    },
    activateButtonText: {
        color: '#f7f8fa',
        fontWeight: '300',
        fontSize: 15,
    },
    deactivateButton: {
        backgroundColor: '#f7f8fa',
        paddingVertical: 6,
        paddingHorizontal: 6,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#A92929',
        minWidth: 80,
        alignItems: 'center',
    },
    deactivateButtonText: {
        color: '#A92929',
        fontWeight: '300',
        fontSize: 15,
    },
});

export const greenModal = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContainer: {
        backgroundColor: '#DEEAD3',
        borderRadius: 16,
        borderColor: '#000000',
        borderWidth: 3,
        padding: 24,
        width: 300,
        alignItems: 'center',
    },
    activateButton: {
        backgroundColor: '#233D4D',
        paddingVertical: 16,
        paddingHorizontal: 30,
        borderRadius: 16,
        minWidth: 80,
        alignItems: 'center',
    },
    activateButtonText: {
        color: '#f7f8fa',
        fontWeight: '300',
        fontSize: 15,
    },
    balaoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 18,
    },
    balaoInner: {
        alignItems: 'center',
    },
    balaoImg: {
        width: 190,
        height: 130,
        top: 20,
        left: 50,
    },
    balaoText: {
        position: 'absolute',
        top: 55,
        right: 16,
        color: '#000000',
        fontSize: 13,
        fontWeight: 'bold',
        transform: [{ rotate: '4.91deg' }],
        textAlign: 'center',
    },
    raposaImg: {
        width: 280,
        height: 250,
    },
});

export const redModal = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContainer: {
        backgroundColor: '#E9CDCD',
        borderRadius: 16,
        borderColor: '#000000',
        borderWidth: 3,
        padding: 24,
        width: 300,
        alignItems: 'center',
    },
    activateButton: {
        backgroundColor: '#233D4D',
        paddingVertical: 16,
        paddingHorizontal: 30,
        borderRadius: 16,
        minWidth: 80,
        alignItems: 'center',
    },
    activateButtonText: {
        color: '#f7f8fa',
        fontWeight: '300',
        fontSize: 15,
    },
    balaoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 18,
    },
    balaoInner: {
        alignItems: 'center',
    },
    balaoImg: {
        width: 200,
        height: 140,
        top: 20,
        left: 50,
    },
    balaoText: {
        position: 'absolute',
        top: 45,
        right: 22,
        color: '#f7f8fa',
        fontSize: 13,
        fontWeight: 'bold',
        transform: [{ rotate: '4.91deg' }],
        textAlign: 'justify',
    },
    raposaImg: {
        width: 280,
        height: 250,
    },
});

export const endTimeModal = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContainer: {
        backgroundColor: '#f7f8fa',
        borderRadius: 16,
        borderColor: '#000000',
        borderWidth: 3,
        padding: 24,
        width: 300,
        alignItems: 'center',
    },
    activateButton: {
        backgroundColor: '#233D4D',
        paddingVertical: 16,
        paddingHorizontal: 30,
        borderRadius: 16,
        minWidth: 80,
        alignItems: 'center',
    },
    activateButtonText: {
        color: '#f7f8fa',
        fontWeight: '300',
        fontSize: 15,
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 30,
        marginTop: 20,
    },
    modalText: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 25,
    },
    correctText: {
        fontSize: 24,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 15,
    },

});

export const SuccessAlert = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(30, 30, 30, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertBox: {
        width: '80%',
        backgroundColor: '#f7f8fa',
        borderRadius: 12,
        paddingVertical: 24,
        paddingHorizontal: 20,
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A3C40',
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#444',
        marginBottom: 24,
        textAlign: 'center',
        lineHeight: 22,
    },
    progressBarBackground: {
        height: 4,
        backgroundColor: '#d0e8dc',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: 4,
        backgroundColor: '#1A3C40',
    },
});

export const cards = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 0.5,
        borderColor: '#01687D',
        padding: 20,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    semestre: {
        fontSize: 24,
        fontWeight: '600',
        color: '#005C6D',
    },
    questoes: {
        fontSize: 14,
        color: '#004854',
        marginTop: 4,
    },
    buttonIniciar: {
        backgroundColor: '#01687D',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        alignSelf: 'flex-end',
        marginTop: 50,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
});

export const subjects = StyleSheet.create({
    buttonsLayer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 12,
    },
    button: {
        backgroundColor: '#CEE7F0',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginRight: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#004854',
    },
});

export const timebutton = StyleSheet.create({
    questionMark: {
        position: "absolute",
        top: -8,
        right: -8,
        backgroundColor: "#619B8A",
        borderRadius: 10,
        padding: 2,
        zIndex: 10,
    },
    dropdownButton: {
        borderWidth: 2,
        borderColor: "#619B8A",
        borderRadius: 24,
        padding: 16,
        justifyContent: "center",
        alignItems: "center",
        width: 72,
        height: 72,
        backgroundColor: "#fff",
    },
    tooltipContainer: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },

    tooltipContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        maxWidth: 320,
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },

    tooltipText: {
        fontSize: 16,
        color: "#333"
    },

    buttonTitle: {
        color: "#333",
        fontWeight: "600",
        marginTop: 6,
        fontSize: 14,
        textAlign: "center",
        width: 80,
    },
});