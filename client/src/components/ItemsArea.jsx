import "fontsource-nunito";
import "../styles.css";
import React, { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import SendIcon from '@material-ui/icons/Send';
import { makeStyles } from '@material-ui/core/styles';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Loading from "./Loading";
const axios = require('axios').default;

const theme = createMuiTheme({
  palette: {
      primary: {
          main: '#1976d2'
      }

  },
})

const useStyles = makeStyles((theme) => ({
  root: {
      margin: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
    height: '3rem'
  },
  cont: {
    textAlign: 'center',
    fontFamily: 'Nunito',
    borderRadius: '25px',
    background: 'white',
    padding: '2rem',
    marginTop: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.5)',
  },
  formControl: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
    },
    margin: theme.spacing(1),
    minWidth: 130,
  },
  footer: {
    padding: theme.spacing(2),
  },
  input: {
    height: '3rem'
  },
  staticInput: {
    color: '#1976d2',
    fontWeight: '500',
    height: '3rem'
  },
}))

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
        Muli Cohen
      {" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function ItemsArea() {
  const classes = useStyles()
  const [inputFields, setInputFields] = useState([
    { seller: '', item: '', title: '' },
  ]);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (localStorage.inputFields !== 'null' && localStorage.inputFields) {
      setInputFields(JSON.parse(localStorage.inputFields))
    }
    }, []);

  useEffect(() => {
    if (loading) {
      axios.post('http://localhost:3001', {     // http://192.168.0.104:3000/ #raspberry
        inputFields
      })
      .then(function (response) {
        let currentItems = [...inputFields];
        let responseArr = response.data.toString().split("\n");
        for (let i = 0; i < currentItems.length; i++) {
          currentItems[i]['title'] = responseArr[i];
        }
        setInputFields(currentItems);
        localStorage.setItem('inputFields', JSON.stringify(currentItems));
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }, [loading]) //removed inputFields due to replication FIX
    
  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    let tempInputFields = [...inputFields];
    tempInputFields = tempInputFields.filter(value => value['seller'] || value['item'])
    setInputFields(tempInputFields)
    console.log(inputFields)
    localStorage.setItem('inputFields', JSON.stringify(tempInputFields));
  };

  const handleChangeInput = (index, event) => {
    const values = [...inputFields];
    values[index][event.target.name] = event.target.value;
    setInputFields(values);
  }

  const handleAddFields = () => {
    setInputFields([...inputFields, { seller: '', item: '',title: '' }])
  }

  const handleRemoveFields = (index) => {
    const values  = [...inputFields];
    if (values.length <= 1) {
      setLoading(false);
      setInputFields([{ seller: '', item: '', title:'' }])
      return;
    } 
    values.splice(index, 1);
    let storageItems = JSON.parse(localStorage.getItem('inputFields'));
    storageItems.splice(index, 1);
    if (storageItems.length === 0) {
      localStorage.removeItem('inputFields');
      setInputFields(values);
      return;
    }
    localStorage.setItem('inputFields', JSON.stringify(storageItems));
    setInputFields(values);
  }

  return (
    <MuiThemeProvider theme={theme}>
    <Container maxWidth="md" className={classes.cont}>
      <h1>Add to My Follow-Up List</h1>
      <form className={classes.root} onSubmit={handleSubmit}>
        { inputFields.map((inputField, index) => (
          <div key={index}>
            <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">Seller</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                name="seller"
                label="Seller"
                value={inputField.seller}
                onChange={event => handleChangeInput(index, event)}
                className={classes.input}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"alive"}>isAlive</MenuItem>
                <MenuItem value={"kleyzemer"}>Kley-Zemer</MenuItem>
                <MenuItem value={"wildguitars"}>Wild-Guitars</MenuItem>
                <MenuItem value={"halilit"}>Halilit</MenuItem>
                <MenuItem value={"ksp"}>KSP</MenuItem>
              </Select>
            </FormControl>
            <TextField className={classes.formControl}
              name="item"
              label="URL"
              variant="outlined"
              InputProps={{
                className: classes.input,
              }}
              value={inputField.item}
              onChange={event => handleChangeInput(index, event)}
            />
            <TextField className={classes.formControl}
              id="standard-read-only-input"
              placeholder="Item"
              name="title"
              value={inputField.title}
              onChange={event => handleChangeInput(index, event)}
              variant="outlined"
              InputProps={{
                className: classes.staticInput,
                readOnly: true,
              }}
            />
            <IconButton className={classes.button}
              onClick={() => handleRemoveFields(index)}
            >
              <RemoveIcon />
            </IconButton>
            <IconButton className={classes.button}
              onClick={() => handleAddFields()}
            >
              <AddIcon />
            </IconButton>
          </div>
        )) }
        <Button
          className={classes.button}
          variant="contained" 
          color="primary" 
          type="submit" 
          endIcon={!loading ? <SendIcon/> : <Loading/>}
          onClick={handleSubmit}
        >{loading ?  'Saving...' : 'Save & Send'}</Button>
      </form>
    </Container>
    <footer className={classes.footer}> <Copyright /></footer>
    </MuiThemeProvider>
  );
}

export default ItemsArea;