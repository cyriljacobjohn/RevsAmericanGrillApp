import 'bootstrap/dist/css/bootstrap.min.css'
import { Button, Card } from 'react-bootstrap';
import React, {useState} from "react";
import { useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';
import Form from 'react-bootstrap/Form';

import './hover.css';
import './customer.css';
import './scrollbar.css';

// const GlobalContext = React.createContext(18);
// const [fontSize, setFontSize] = createGlobalstate(18);
let fontSize2 = 18;
let boxWidth = 10;

let fromLangdef = 'en';
let toLangdef = 'en';

/**
 * @param inputText text to be translated 
 * @param setFunc function to get api call for google translate
 * @exception Exception if there was error in translation request
 */

 const translate = (inputText, setFunc) => {
  
  
  let fromLang = fromLangdef;
  let toLang = toLangdef;
  const API_KEY = "AIzaSyDXQjbR4ECpwLWWOlU-9dsQdbQumj_J2S4";
  let url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
  url += '&q=' + encodeURI(inputText);
  url += `&source=${fromLang}`;
  url += `&target=${toLang}`; 
  
  fetch(url, { 
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  })
  .then(res => res.json())
  .then((response) => {
    setFunc(response.data.translations[0].translatedText);
    // return response.data.translations[0].translatedText;
  })
  .catch(error => {
    console.log("There was an error with the translation request: ", error);
  }
  );
}

/**
 * @param text the text that is going to be translated
 * @return translated text
 */

const TranslateText = ({text}) => {
  const [nameTranslated, setNametranslated] = useState(text);
  useEffect(() => {
    translate(text, setNametranslated);
  }, [])

  return (
    <div>
      {nameTranslated}
    </div>
  )
}

const picture = new URL("../Resources/KyleField.jpg", import.meta.url);
const logo = new URL("../Resources/yellowLink.jpg", import.meta.url);

const myStyle = {
  height: "100vh",
  objectFit: "cover",
  
  position: "fixed",
  left: "-18vw",
  top: "0",
  z: "-2",
  backgroundAttachment: 'fixed',
};

const glassPane = {
  position: 'relative',
  margin: '5vh auto',
  top: '0',
  right: '0',
  bottom: '0',
  left: '0',
  backgroundColor: 'rgba(90, 90, 90, .15)',
  backdropFilter: 'blur(5px)',
  height: '90vh',
  width: '90vw',
  overflow: 'hidden',
  borderRadius: '20px',
  
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gridAutoRows: 'minmax(500px, auto)',
  gap: '2vw',
  padding: '1%',
  // boxShadow: 'inset 0px 0px 40px 40px rgb(0,0,0,0)',
  // boxShadow: '0 0 10px rgb(0,0,0)',
};

const googleMaps = {
  
  margin: '25vh auto',
  
  position: 'relative',
  padding:'20px',
  
  backgroundColor: 'rgba(90, 90, 90, .15)',
  backdropFilter: 'blur(5px)',
  height: '70vh',
  width: '70vw',
  overflow: 'hidden',
  borderRadius: '20px',

  
  
}


//----Invent Styles Begin----
const inventoryContainerStyle = {
  
  width: '100%',
  height: '100%',
  overflow: 'auto',
  scrollbarWidth: 'thin',
}

const gridContainer = {
  //Grid layout
  display: 'flex',
  flexWrap: 'wrap',
  // gridTemplateColumns: '100px 100px 100px 100px', 

  // gridTemplateColumns: 'repeat(4, 7vw)',
  // gridTemplateColumns: 'repeat(, 7vw)',
  // gridTemplateRows: 'repeat(8, 1fr)',
  gap: '3vw',
  justifyContent: "center",
  placeItems: 'center',
}

//--Checkout Style Begins
const checkoutStyle = {
  position: "relative",
  width: "100%",
  height: "100%",
};



const orderItemStyle = {
  height: '90%',
  overflow: 'auto',
}


/**
 * @param order used to hold the order
 * @param menu used to hold the name of the menu items
 * @return order display
 */

const OrderDisplay = ({order, menu}) => {
  if(menu.length <= 0) return;

  function findMenuItem(id){
    for(var i=0; i<menu.length; ++i){
      if(menu[i].food_id === id) return menu[i]; 
    }
  }
  
  return (
    <div style={orderItemStyle}>
      {order.map((id, index) => <OrderItem item={findMenuItem(id)} key={index}/>)}
    </div>
  )
}
/**
 * @param item used to hold the order menu item names
 */

const OrderItem = ({item}) => {
  const name = item.menuitem;
  const [nameTranslated, setNametranslated] = useState(name);

  useEffect(() => {
    translate(name, setNametranslated);
  }, [])
  return (
    <p><font size="+2">{'$' + item.price + " " + nameTranslated}</font></p>
  )
}

const GoogleMapcontainerStyle = {
  width: '100%',
  height: '100%',
  overflow: 'auto',
  borderRadius: '20px'

};


/**
 * @exception Exception if connecting to databse has an error
 * @return the customer side GUI
*/


const Customer = () => {
  const myRef = useRef();
  const [menuTable, setMenuTable] = useState([]);
  const [order, setOrder] = useState([]);
  const [total, setTotal] = useState(0.0);
  const [fontSize, setFontSize] = useState(fontSize2);
  const [boxSize, setBoxSize] = useState(boxWidth);
  const [Langvar, setLangvar] = useState(toLangdef);

  /**
 * @param menu used to hold the menu items
 * @param order used to hold the order 
 * @param setOrder used to hold the order made
 * @param setTotal used to hold the total of the order
 * @return grid of the menu items and order
 */


const MenuGrid = ({menu, order, setOrder, setTotal}) => {
  return (
    <div style={gridContainer}>
      {menu.map((item, index) => <MenuElement name={item.menuitem} id={item.food_id} price={item.price} order={order} 
        setOrder={setOrder} setTotal={setTotal} key={index}/>)}
    </div>
  )
}

/**
 * @param name used to hold the name of the menu items
 * @param id used to hold the id of the menu items 
 * @param price used to hold the price of the menu items 
 * @param setOrder used to hold the order made
 * @param setTotal used to hold the total of the order
 * @return buttons for the menu items and their elements
 */

const MenuElement = ({name, id, price, setOrder, setTotal}) => {
// const [fontSize, setFontSize] = useGlobalState(count);
// const [fontSize, setFontSize] = useState(18);

  const [nameTranslated, setNametranslated] = useState(name);
  useEffect(() => {
    translate(name, setNametranslated);
  }, [])
  // console.log(fontSize2);

  let output = {nameTranslated}.nameTranslated;
  return <Button id="buttonHoverEffect" class="MenuItemButton" style={{backgroundColor: 'rgba(80, 0, 0, .8)', color: 'white', width: `${boxWidth}vw`, height: '10vw', fontSize: `${fontSize2}px`}} 
    onClick={(event) => { setOrder(current => [...current, id]);
      setTotal(current => current + parseFloat(price));
      }}>{output}</Button>;

}

  /**
 * @param inputText text to be translated 
 * @param setFunc function to get api call for google translate
 * @exception Exception if there was error in translation request
 */

const translate = (inputText, setFunc) => {
  
  
  let fromLang = fromLangdef;
  let toLang = toLangdef;
  const API_KEY = "AIzaSyDXQjbR4ECpwLWWOlU-9dsQdbQumj_J2S4";
  let url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
  url += '&q=' + encodeURI(inputText);
  url += `&source=${fromLang}`;
  url += `&target=${toLang}`; 
  
  fetch(url, { 
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  })
  .then(res => res.json())
  .then((response) => {
    setFunc(response.data.translations[0].translatedText);
    // return response.data.translations[0].translatedText;
  })
  .catch(error => {
    console.log("There was an error with the translation request: ", error);
  }
  );
}

/**
 * @param text the text that is going to be translated
 * @return translated text
 */

const TranslateText = ({text}) => {
  const [nameTranslated, setNametranslated] = useState(text);
  useEffect(() => {
    translate(text, setNametranslated);
  }, [])

  return (
    <div>
      {nameTranslated}
    </div>
  )
}
  
  const increaseFontSize = () => {
    if(fontSize2 > 48){
      return;
    }
    if(fontSize2 === 32){
      boxWidth = 30;
      setBoxSize(30);
    }
    if(fontSize2 === 22){
      boxWidth = 12;
      setBoxSize(12);
    }
    if(fontSize2 === 28){
      boxWidth = 14;
      setBoxSize(14);
    }
    setFontSize(fontSize + 2);
    fontSize2 += 2;

  }
  
  const decreaseFontSize = () => {
    if(fontSize2 < 16){
      return;
    }
    if(fontSize2 === 40){
      boxWidth = 30;
      setBoxSize(30);
    }

    if(fontSize2 === 30){
      boxWidth = 12;
      setBoxSize(12);
    }

    if(fontSize2 === 22){
      boxWidth = 10;
      setBoxSize(10);
    }

    setFontSize(fontSize - 2);
    fontSize2 -= 2;

  }
  // For google maps animation
  const observer = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if(entry.isIntersecting){
      entry.target.classList.add('show');
    }
    else{
      entry.target.classList.remove('show');
    }
  });
  if(myRef.current != null){
    observer.observe(myRef.current);
  }

  useEffect(() => {
    axios('https://revsgrill.up.railway.app/manager/menu')
    .then(res => setMenuTable(res.data))
    .catch(err => console.log(err))
  }, []);

   /**
 * @param id used to hold the id of the menu items 
 */

  function findMenuItem(id){
    for(var i=0; i<menuTable.length; ++i){
      if(menuTable[i].food_id === id) return menuTable[i]; 
    }
  }

  /**
 * @return the details of the menu item chosen
 */

  function createJSON(){
    var res = []
    for(var i=0; i<order.length; ++i){
      var item = findMenuItem(order[i]);
      res.push(
        {
          "itemid": order[i],
          "itemname": item.menuitem,
          "price": item.price
        }
      )
    }
    return res;
  }

  const center = {
    lat: 30.612545,
    lng: -96.34074
  };
    const { isLoaded } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: "AIzaSyBBOsZmB4HCcudFw2G4eawdpraS4FfP0-I"
    })
  
    const [map, setMap] = React.useState(null)
  
    const onLoad = React.useCallback(function callback(map) {
      const bounds = new window.google.maps.LatLngBounds(center);
      map.fitBounds(bounds);
      setMap(map)
    }, [])
  
    const onUnmount = React.useCallback(function callback(map) {
      setMap(null)
    }, [])

    

    
  


  return isLoaded ? (

    <div style={{height:'200vh'}}>
      <img src={picture} style={myStyle} alt='Kyle Field' />
    <div style={{position: 'absolute', zIndex: '2'}}>
      <a href='https://revsgrill.onrender.com/?#pills-login'><img src={logo} style={{marginLeft: '10px', height:'60px', width:'60px', borderRadius:'25%'}} alt='Go Home' /></a>
    </div>
      

      <div style={glassPane}>
        <Card style={inventoryContainerStyle} id='scroll'>
          <Card.Body>
            <Card.Title style={{ textAlign: 'center' , color: 'black'}}>
              <TranslateText text={'Menu Items'}></TranslateText>
              <div style={{display: 'flex', justifyContent: 'right'}}>
                <Button variant="secondary" style={{marginRight: '5px'}} onClick = {decreaseFontSize}>-</Button>
                <Button variant="primary" style={{marginLeft: '5px'}} onClick = {increaseFontSize} >+</Button>
              </div>
            </Card.Title>
        
            <div class="container my-5">
              <div class="tab-content" id="nav-tabContent">
                <div class="tab-pane fade show active p-3" id="nav-home" role="tabpanel"
                aria-labelledby='nav-home-tab'>
                  <MenuGrid menu={menuTable} setOrder={setOrder} setTotal={setTotal}/>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card style={checkoutStyle}>
          <Card.Body>
            <Card.Title style={{ textAlign: 'center', color: 'black'}}>
              <TranslateText text={'Your Order'}></TranslateText>
            </Card.Title>
            <Card style={{height: '90%'}}>
              <Card.Body style={{height:'1vh'}}>
                <div style={{textAlign: 'center'}}>
                <h2 style={{textAlign: 'center', color: 'black', display: 'inline-flex'}}>
                  <TranslateText text={'Total'}></TranslateText> : ${total.toFixed(2)}</h2>
                </div>
                <OrderDisplay order={order} menu={menuTable}/>
                <Button style={{marginLeft: '695px', marginTop: '-1270px', width: '70px', height: '60px', backgroundColor: 'rgba(80, 0, 0, .8)'}} onClick={(event) => {
                  setOrder([]); setTotal(0.00);}}><TranslateText text={'Clear Order'}></TranslateText></Button>
              </Card.Body>
            </Card>
            <Button  style={{backgroundColor: 'rgba(80, 0, 0, .8)', color: 'white', width: '100%', marginTop: '5px'}} onClick={(event) => {
              axios.post('https://revsgrill.up.railway.app/server/placeorder', createJSON()
              ).then((res) => {setOrder([]); setTotal(0.00);}).catch(err => console.log(err));}}>
                <TranslateText text={'Check Out'}></TranslateText>
                </Button>
          </Card.Body>
        </Card>
      </div>

      <div style={{ position: 'absolute', left: '5px', bottom: '5px' }}>
        <Form.Select aria-label="Default select" style={{ textAlign: 'center' }} onChange={(event) => {
        toLangdef = event.target.value;
        setLangvar(event.target.value);
      }} >
          <option value={"en"}>English</option>
          <option value={"es"}>Español</option>
          <option value={"de"}>Deutsch</option>
          <option value={"fr"}>Français</option>
          <option value={"ar"}>عربي</option>
          <option value={"zh-CN"}>中文简体</option>
          <option value={"ko"}>	한국어</option>
          <option value={"hi"}>	हिन्दी</option>
          <option value={"ru"}>Русский</option>
          <option value={"pt"}>Português</option>
        </Form.Select>
      </div>
      
      <div style={googleMaps} class='hidden' ref={myRef}>
        <GoogleMap 
            mapContainerStyle={GoogleMapcontainerStyle}
            center={center}
            onLoad={onLoad}
            onUnmount={onUnmount}
            zoom={19}
            >
            
          </GoogleMap>
      </div>
    </div>

    
  ) : <></>
};

export default Customer;