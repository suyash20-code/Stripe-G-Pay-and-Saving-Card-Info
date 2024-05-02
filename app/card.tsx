import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import { useStripe,usePaymentSheet } from '@stripe/stripe-react-native';
//npx eas build --profile development --platform android --message "stripe"
const Card = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [ready, setReady] = useState(false);
  const stripe = useStripe();
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
    const response = await fetch('https://5d7a-163-53-203-209.ngrok-free.app/payment-sheet', {
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
  const chargeCustomer = async () => {
    const response = await fetch(`https://5d7a-163-53-203-209.ngrok-free.app/charge-customer?customerId=cus_Q22Uo0BTtOfUlv`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const {paymentIntent, ephemeralKey, customer} = await response.json();

    return {
      paymentIntent,
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

  const subscribe = async () => {
    try {
      // sending request
      const response = await fetch("https://5d7a-163-53-203-209.ngrok-free.app/payByCustomer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) return Alert.alert(data.message);
      const clientSecret = data.clientSecret;
      const initSheet = await stripe.initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "suyash.com",
        customerId: "cus_Q22Uo0BTtOfUlv",
      
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
      if (initSheet.error) return Alert.alert(initSheet.error.message);
      const presentSheet = await stripe.presentPaymentSheet({
        clientSecret,
      });
      if (presentSheet.error) return Alert.alert(presentSheet.error.message);
      Alert.alert("Payment complete, thank you!");
      // router.push('/two');
    } catch (err) {
      console.error(err);
      Alert.alert("Something went wrong, try again later!");
    }
  };
  
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
      <Button title="charge" onPress={subscribe}></Button>
    </View>
  );
};

export default Card;
