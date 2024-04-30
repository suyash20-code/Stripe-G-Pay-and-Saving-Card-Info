import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import { useStripe,usePaymentSheet } from '@stripe/stripe-react-native';

const Card = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [ready, setReady] = useState(false);
  const {
    initPaymentSheet,
    presentPaymentSheet,
    loading,
    resetPaymentSheetCustomer,
  } = usePaymentSheet();
//   const { initPaymentSheet, presentPaymentSheet } = useStripe();
useEffect(() => {
    initialisePaymentSheet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const initialisePaymentSheet = async () => {
    // const {paymentIntent} = await fetchPaymentSheetParams();
    const {setupIntent, ephemeralKey, customer} = await fetchPaymentSheetParams();
    const {error} = await initPaymentSheet({
      customerId: customer,
      setupIntentClientSecret: setupIntent,
      customerEphemeralKeySecret:ephemeralKey,
      merchantDisplayName: 'Example Inc.',
    //   applePay: {
    //     merchantCountryCode: 'US',
    //   },
    //   googlePay: {
    //     merchantCountryCode: 'US',
    //     testEnv: true,
    //     currencyCode: 'usd',
    //   },
      allowsDelayedPaymentMethods: true,
      returnURL: 'stripe-example://stripe-redirect',
    });
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      setReady(true);
    }
  };
  const fetchPaymentSheetParams = async () => {
    const response = await fetch('https://d5d6-163-53-203-209.ngrok-free.app/payment-sheet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const {setupIntent, ephemeralKey, customer} = await response.json();

    return {
        setupIntent,
      ephemeralKey,
      customer,
    };
  };

  async function buy() {
    const {error} = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'The payment was confirmed successfully');
      setReady(false);
    }
  }
//   const handlePay = async () => {
//     try {
//         const response = await axios.post('https://d5d6-163-53-203-209.ngrok-free.app/create-customer');
  
//         const { customerId, message } = response.data;
//         Alert.alert('Success', `${message}\nCustomer ID: ${customerId}`);
//       } catch (error) {
//         Alert.alert('Error', 'Something went wrong. Please try again.');
//       }
//   };


  return (
    <View style={{ padding: 20 }}>
      {/* <Text>Card Number</Text>
      <TextInput
        value={cardNumber}
        onChangeText={setCardNumber}
        placeholder="Enter card number"
      />
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Enter name"
      />
      <Text>Expiration Date (MM/YY)</Text>
      <TextInput
        value={expiry}
        onChangeText={setExpiry}
        placeholder="Enter expiration date"
      />
      <Text>CVC</Text>
      <TextInput
        value={cvc}
        onChangeText={setCvc}
        placeholder="Enter CVC"
      />
      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Enter email address"
      /> */}
      <Button title="Pay" onPress={buy} />
    </View>
  );
};

export default Card;
