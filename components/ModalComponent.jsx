import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import Colors from "../constants/Colors";

const ModalComponent = ({
  visible,
  title,
  options = [],
  onRequestClose,
  modalHeight,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onRequestClose}
    >
      <View style={styles.modalContainer}>
        <View
          style={[
            styles.modalContent,
            { height: modalHeight ? modalHeight : 150 },
          ]}
        >
          <Text style={styles.modalTitle}>{title}</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              marginTop: 20,
            }}
          >
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.modalButton}
                onPress={option.onPress}
              >
                <Text style={styles.modalButtonText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalComponent;

const styles = {
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.dark.primary,
  },
  modalContent: {
    width: 320,
    padding: 20,
    backgroundColor: Colors.dark.tabBackground,
    borderRadius: 10,
    alignItems: "center",
    height: 150,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    lineHeight: 20,
  },
  modalMessage: {
    fontSize: 14,
    marginVertical: 10,
    color: "white",
  },
  modalButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: Colors.dark.secondary,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
};
