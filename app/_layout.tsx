import { Stack } from 'expo-router';
import { StripeProvider } from '@stripe/stripe-react-native';
export default function Layout() {
  return (
    <StripeProvider publishableKey="pk_test_51NqfJ4SJIGArQAxoTt562ovvx9vyhovKlx7fwS1ETMezyklo3PMYaLX4oS8N5apJf8iGECt4G3R66GrcCqx0S3Zv00eIdT1Rl8" >
  <Stack />
  </StripeProvider>
);
}
