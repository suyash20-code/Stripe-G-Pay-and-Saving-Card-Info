import {PlatformPay, PlatformPayButton, confirmPlatformPayPayment, usePlatformPay} from '@stripe/stripe-react-native';
import React from 'react';
import { Alert, View } from 'react-native';
//npx eas build --profile development --platform android --message "stripe"
function Home() {
  const {
    isPlatformPaySupported,
    confirmPlatformPayPayment,
  } = usePlatformPay();


  // React.useEffect(() => {
  //   (async function () {
  //     if (!(await isPlatformPaySupported({ googlePay: {testEnv: true} }))) {
  //       Alert.alert('Google Pay is not supported.');
  //       return;
  //     }
  //   })();
  // }, []);


  const fetchPaymentIntentClientSecret = async () => {
    // Fetch payment intent created on the server, see above
    const response = await fetch(`https://c5de-163-53-203-209.ngrok-free.app/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currency: 'usd',
      }),
    });
    const { clientSecret } = await response.json();

    return clientSecret;
  };

  const pay = async () => {
    const clientSecret = await fetchPaymentIntentClientSecret();

    const { error } = await confirmPlatformPayPayment(
      clientSecret,
      {
        googlePay: {
          testEnv: true,
          merchantName: 'test-ecommerce',
          merchantCountryCode: 'US',
          currencyCode: 'USD',
          billingAddressConfig: {
            format: PlatformPay.BillingAddressFormat.Full,
            isPhoneNumberRequired: true,
            isRequired: true,
          },
        },
      }
    );

    if (error) {
      Alert.alert(error.code, error.message);
      // Update UI to prompt user to retry payment (and possibly another payment method)
      return;
    }
    Alert.alert('Success', 'The payment was confirmed successfully.');
  };

  return (
    <View>
      <PlatformPayButton
        type={PlatformPay.ButtonType.Pay}
        onPress={pay}
        style={{
          width: '100%',
          height: 50,
        }}
      />
    </View>
  );
}
export default Home