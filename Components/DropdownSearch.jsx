import React, { useState } from 'react';
import { activities } from './ActivitiesList';
import { View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const DropDownSearch = () => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState([]);
    const [items, setItems] = useState(activities);
  
    return (
      <View style={{
        backgroundColor: '#FFD58000',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15,
        paddingVertical:15
      }}>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          listMode="MODAL"
          searchable={true}
          addCustomItem={true}
  
          theme="LIGHT"
          multiple={false}
          mode="BADGE"
        />
      </View>
    );
  }

  export default DropDownSearch;
  