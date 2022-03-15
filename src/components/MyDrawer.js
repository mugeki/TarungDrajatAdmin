import React, {useContext} from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import MateriStack from './MateriStack';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {AuthContext} from './AuthProvider';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const {logout} = useContext(AuthContext);
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Logout" onPress={() => logout()} />
    </DrawerContentScrollView>
  );
}

export default function MyDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="MateriStack"
        component={MateriStack}
        options={({route}) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'Materi';
          return {
            drawerLabel: 'Materi',
            headerTitle: 'Materi',
            headerShown:
              routeName === 'MateriEditForm' || routeName === 'MateriAddForm'
                ? false
                : true,
          };
        }}
      />
    </Drawer.Navigator>
  );
}
