import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import MateriStack from './MateriStack';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Help" onPress={() => alert('Link to help')} />
    </DrawerContentScrollView>
  );
}

export default function MyDrawer() {
  return (
    <Drawer.Navigator>
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
