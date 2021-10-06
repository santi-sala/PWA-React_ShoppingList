import React, { useEffect, useState } from 'react';
import './App.css';
import firebase from 'firebase';
import 'firebase/firestore';

import {
  Card,
  Button,
  TextField,
  Select,
  IconButton,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
} from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';

const firebaseConfig = {
  apiKey: 'AIzaSyDLXKYWux-h0vXur_by706nqIZyatqm0nU',
  authDomain: 'shoppinglist-ec019.firebaseapp.com',
  projectId: 'shoppinglist-ec019',
  storageBucket: 'shoppinglist-ec019.appspot.com',
  messagingSenderId: '888435428911',
  appId: '1:888435428911:web:0db93d9da05961763dc0da',
  measurementId: 'G-N4PF2BRZF7',
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

function App() {
  const [item, setItem] = useState('');
  const [count, setCount] = useState(1);

  // loading state
  const [loading, setLoading] = useState(true);
  // shopping list items state
  const [items, setItems] = useState([]);

  // load shopping list items
  useEffect(() => {
    const fetchData = async () => {
      // database
      const db = firebase.firestore();
      // data
      const data = await db.collection('items').get();
      // shopping list items: name, count and id
      const items = data.docs.map((doc) => {
        return {
          name: doc.data().name,
          count: doc.data().count,
          id: doc.id,
        };
      });
      // set states
      setItems(items);
      setLoading(false);
    };
    // start loading data
    fetchData();
  }, []); // called only once

  // render loading... text
  if (loading) return <p>Loading...</p>;

  // create shopping list items
  const sh_items = items.map((item, index) => {
    return (
      <Card style={container} key={index}>
        <div style={cardStyle}>
          <Typography
            variant="body2"
            component="p"
            style={{
              display: 'flex',
              alignSelf: 'center',
              paddingLeft: 20,
            }}
          >
            {item.name} {item.count}
          </Typography>

          <IconButton aria-label="delete" onClick={() => deleteItem(item)}>
            <DeleteIcon />
          </IconButton>
        </div>
      </Card>
    );
  });

  // add a new item to data base and shopping list items
  const addItem = async () => {
    // create a new shopping list item
    let newItem = { name: item, count: count, id: '' };
    // add to database
    const db = firebase.firestore();
    let doc = await db.collection('items').add(newItem);
    // get added doc id and set id to newItem
    newItem.id = doc.id;
    // update states
    setItems([...items, newItem]);
    setItem('');
    setCount(1);
  };

  // delete item from database and UI
  const deleteItem = async (item) => {
    // remove from db
    const db = firebase.firestore();
    db.collection('items').doc(item.id).delete();
    // delete from items state and update state
    let filteredArray = items.filter(
      (collectionItem) => collectionItem.id !== item.id
    );
    setItems(filteredArray);
  };

  // render shopping list
  return (
    <div>
      <Typography
        variant="h2"
        style={{
          textAlign: 'center',
          fontWeight: 'lighter',
          color: '#281391',
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        Shopping List
      </Typography>
      <form noValidate autoComplete="off" style={inputStyle}>
        <TextField
          id="standard-basic"
          label="Item"
          onChange={(e) => setItem(e.target.value)}
          style={{ marginRight: 20 }}
        />
        <FormControl>
          <InputLabel shrink>Count</InputLabel>
          <Select
            labelId="Count"
            id="count"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            style={{ marginRight: 20 }}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={6}>6</MenuItem>
            <MenuItem value={7}>7</MenuItem>
            <MenuItem value={8}>8</MenuItem>
            <MenuItem value={9}>9</MenuItem>
            <MenuItem value={10}>10</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => addItem()}
        >
          ADD
        </Button>
      </form>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="App">{sh_items}</div>
      </div>
    </div>
  );
}

const inputStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignSelf: 'center',
  paddingBottom: 10,
  paddingTop: 10,
};

const container = {
  display: 'flex',
  justifyContent: 'center',
  width: 350,
  backgroundColor: '#18f5a4',
  marginBottom: 10,
};

const cardStyle = {
  display: 'flex',
  width: 350,
  justifyContent: 'space-between',
};

export default App;
