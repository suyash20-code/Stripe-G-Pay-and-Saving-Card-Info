import { Stack, Link } from 'expo-router';
import { View } from 'react-native';

import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { ScreenContent } from '~/components/ScreenContent';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />
    
        <View style={{flex:1, justifyContent:'center'}}>
        <Link href={{ pathname: '/gpay', params: { name: 'Dan' } }} asChild>
          <Button title="G-Pay" />
        </Link>
        <View style={{marginTop:30}}>
        <Link href={{ pathname: '/card', params: { name: 'Dan' } }} asChild>
          <Button title="Card" />
        </Link>
        </View>
       
        </View>
        
     
    </>
  );
}