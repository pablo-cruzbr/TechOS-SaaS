// Usuários Logados
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from '../pages/Dashboard';
import ListOrdemdeServicoInterna from '../pages/ListOrdemdeServicoInterna';

const Stack = createNativeStackNavigator();


function appRoutes(){
    return(
        <Stack.Navigator>
            <Stack.Screen 
            name='Dashboard' 
            component={Dashboard} 
            options={{headerShown: false}}/>

             <Stack.Screen
            name="ListOrdemdeServicoInterna" 
            component={ListOrdemdeServicoInterna}
            options={{headerShown: false}}
        />
        </Stack.Navigator>
    )
}

export default appRoutes;