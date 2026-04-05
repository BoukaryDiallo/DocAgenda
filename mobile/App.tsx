import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, View} from 'react-native';

import {AuthProvider, useAuthContext} from './contexts/AuthContext';
import {NotificationProvider, useNotificationContext} from './contexts/NotificationContext';
import Chargement from './components/Chargement';


import SplashScreen from './screens/SplashScreen';
import Connexion from './screens/Connexion';
import Inscription from './screens/Inscription';


import Dashboard from './screens/Dashboard';
import ListeMedecins from './screens/ListeMedecins';
import PriseRendezVous from './screens/PriseRendezVous';
import MesRendezVous from './screens/MesRendezVous';
import DetailRendezVous from './screens/DetailRendezVous';
import Profil from './screens/Profil';


import AdminDashboard from './screens/AdminDashboard';
import GestionRendezVous from './screens/GestionRendezVous';
import GestionMedecins from './screens/GestionMedecins';
import FormulaireMedecin from './screens/FormulaireMedecin';
import GestionPatients from './screens/GestionPatients';
import DetailMedecin from './screens/DetailMedecin';


import Notifications from './screens/Notifications';

const AuthStack = createNativeStackNavigator();
const MedecinsStack = createNativeStackNavigator();
const RDVStack = createNativeStackNavigator();
const AdminMedecinsStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const headerOptions = {
  headerStyle: {backgroundColor: '#1a1a2e'},
  headerTintColor: '#f0ead6',
  headerTitleStyle: {fontWeight: '900' as const, fontSize: 18, letterSpacing: 1},
  headerShadowVisible: false,
};

const stackScreenOptions = {
  ...headerOptions,
  animation: 'slide_from_right' as const,
  contentStyle: {backgroundColor: '#1a1a2e'},
};

const tabScreenOptions = {
  headerShown: false,
  tabBarStyle: {
    backgroundColor: '#1a1a2e',
    borderTopWidth: 2,
    borderTopColor: '#2a2a4e',
    paddingTop: 6,
    paddingBottom: 8,
    height: 60,
  },
  tabBarActiveTintColor: '#e85d4a',
  tabBarInactiveTintColor: '#6b6453',
  tabBarLabelStyle: {
    fontSize: 11,
    fontWeight: '900' as const,
    letterSpacing: 1,
  },
};


function TabIcon({letter, color, badge}: {letter: string; color: string; badge?: number}) {
  return (
    <View style={{width: 28, height: 24, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{color, fontSize: 20, fontWeight: '900'}}>{letter}</Text>
      {badge !== undefined && badge > 0 && (
        <View
          style={{
            position: 'absolute',
            top: -4,
            right: -8,
            backgroundColor: '#e85d4a',
            borderRadius: 8,
            minWidth: 16,
            height: 16,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 3,
          }}>
          <Text style={{color: '#fff', fontSize: 9, fontWeight: '900'}}>
            {badge > 99 ? '99+' : badge}
          </Text>
        </View>
      )}
    </View>
  );
}


function MedecinsNavigator() {
  return (
    <MedecinsStack.Navigator screenOptions={stackScreenOptions}>
      <MedecinsStack.Screen name="ListeMedecins" component={ListeMedecins} options={{title: 'MÉDECINS'}} />
      <MedecinsStack.Screen name="PriseRendezVous" component={PriseRendezVous} options={{title: 'RENDEZ-VOUS'}} />
    </MedecinsStack.Navigator>
  );
}

function RDVNavigator() {
  return (
    <RDVStack.Navigator screenOptions={stackScreenOptions}>
      <RDVStack.Screen name="MesRendezVous" component={MesRendezVous} options={{title: 'MES RDV'}} />
      <RDVStack.Screen name="DetailRendezVous" component={DetailRendezVous} options={{title: 'DÉTAIL'}} />
    </RDVStack.Navigator>
  );
}

function PatientTabs() {
  const {nonLues} = useNotificationContext();

  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen
        name="AccueilTab"
        component={Dashboard}
        options={{
          title: 'ACCUEIL',
          headerShown: true,
          ...headerOptions,
          headerTitle: 'DOC.AGENDA',
          tabBarIcon: ({color}) => <TabIcon letter="A" color={color} />,
        }}
      />
      <Tab.Screen
        name="MedecinsTab"
        component={MedecinsNavigator}
        options={{
          title: 'MÉDECINS',
          tabBarIcon: ({color}) => <TabIcon letter="M" color={color} />,
        }}
      />
      <Tab.Screen
        name="RDVTab"
        component={RDVNavigator}
        options={{
          title: 'MES RDV',
          tabBarIcon: ({color}) => <TabIcon letter="R" color={color} />,
        }}
      />
      <Tab.Screen
        name="NotificationsTab"
        component={Notifications}
        options={{
          title: 'NOTIFS',
          headerShown: true,
          ...headerOptions,
          headerTitle: 'NOTIFICATIONS',
          tabBarIcon: ({color}) => <TabIcon letter="N" color={color} badge={nonLues} />,
        }}
      />
      <Tab.Screen
        name="ProfilTab"
        component={Profil}
        options={{
          title: 'PROFIL',
          headerShown: true,
          ...headerOptions,
          headerTitle: 'PROFIL',
          tabBarIcon: ({color}) => <TabIcon letter="P" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}


function AdminMedecinsNavigator() {
  return (
    <AdminMedecinsStack.Navigator screenOptions={stackScreenOptions}>
      <AdminMedecinsStack.Screen name="GestionMedecins" component={GestionMedecins} options={{title: 'MÉDECINS'}} />
      <AdminMedecinsStack.Screen name="DetailMedecin" component={DetailMedecin} options={{title: 'DÉTAIL'}} />
      <AdminMedecinsStack.Screen
        name="FormulaireMedecin"
        component={FormulaireMedecin}
        options={({route}) => ({title: route.params?.medecin ? 'MODIFIER' : 'NOUVEAU'})}
      />
    </AdminMedecinsStack.Navigator>
  );
}

function AdminTabs() {
  const {nonLues} = useNotificationContext();

  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen
        name="AdminAccueilTab"
        component={AdminDashboard}
        options={{
          title: 'ACCUEIL',
          headerShown: true,
          ...headerOptions,
          headerTitle: 'DOC.AGENDA',
          tabBarIcon: ({color}) => <TabIcon letter="A" color={color} />,
        }}
      />
      <Tab.Screen
        name="GestionRDVTab"
        component={GestionRendezVous}
        options={{
          title: 'RDV',
          headerShown: true,
          ...headerOptions,
          headerTitle: 'RENDEZ-VOUS',
          tabBarIcon: ({color}) => <TabIcon letter="R" color={color} />,
        }}
      />
      <Tab.Screen
        name="AdminMedecinsTab"
        component={AdminMedecinsNavigator}
        options={{
          title: 'MÉDECINS',
          tabBarIcon: ({color}) => <TabIcon letter="M" color={color} />,
        }}
      />
      <Tab.Screen
        name="PatientsTab"
        component={GestionPatients}
        options={{
          title: 'PATIENTS',
          headerShown: true,
          ...headerOptions,
          headerTitle: 'PATIENTS',
          tabBarIcon: ({color}) => <TabIcon letter="P" color={color} />,
        }}
      />
      <Tab.Screen
        name="NotificationsTab"
        component={Notifications}
        options={{
          title: 'NOTIFS',
          headerShown: true,
          ...headerOptions,
          headerTitle: 'NOTIFICATIONS',
          tabBarIcon: ({color}) => <TabIcon letter="N" color={color} badge={nonLues} />,
        }}
      />
      <Tab.Screen
        name="AdminProfilTab"
        component={Profil}
        options={{
          title: 'PROFIL',
          headerShown: true,
          ...headerOptions,
          headerTitle: 'PROFIL',
          tabBarIcon: ({color}) => <TabIcon letter="U" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}


const navTheme = {
  dark: true,
  colors: {
    background: '#1a1a2e',
    card: '#1a1a2e',
    text: '#f0ead6',
    border: '#2a2a4e',
    primary: '#e85d4a',
    notification: '#e85d4a',
  },
  fonts: {
    regular: {fontFamily: 'System', fontWeight: '400' as const},
    medium: {fontFamily: 'System', fontWeight: '500' as const},
    bold: {fontFamily: 'System', fontWeight: '700' as const},
    heavy: {fontFamily: 'System', fontWeight: '900' as const},
  },
};

function Navigation() {
  const {user, loading} = useAuthContext();
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (loading) {
    return <Chargement />;
  }

  return (
    <NavigationContainer theme={navTheme}>
      {user ? (
        user.role === 'admin' ? <AdminTabs /> : <PatientTabs />
      ) : (
        <AuthStack.Navigator screenOptions={{headerShown: false}}>
          <AuthStack.Screen name="Connexion" component={Connexion} />
          <AuthStack.Screen name="Inscription" component={Inscription} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Navigation />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
