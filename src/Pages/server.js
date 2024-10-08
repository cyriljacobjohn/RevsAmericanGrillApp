import 'bootstrap/dist/css/bootstrap.min.css'
import { Button, Card } from 'react-bootstrap';

import axios from 'axios';
import { useEffect, useState } from 'react';
import './hover.css';
import './hover.css';
import './scrollbar.css';

const picture = new URL("../Resources/KyleField.jpg", import.meta.url);
const logo = new URL("../Resources/yellowLink.jpg", import.meta.url);



const myStyle = {
  height: '100vh',
  objectFit: 'cover',
  overflow: 'hidden',
  position: 'fixed',
  left: '-18vw',
  top: '0',
  z: '-2'
}

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
}


//----Inventory Styles Begin----
const inventoryContainerStyle = {

  width: '100%',
  height: '100%',
  overflow: 'auto',
}

const gridContainer = {
  display: 'grid',
  gap: '3vw',
  gridTemplateColumns: 'repeat(4, 7vw)',
  justifyContent: "center",
  placeItems: 'center',
}

//Checkout 
const checkoutStyle = {

  position: 'relative',
  width: '100%',
  height: '100%',
}

const orderItemStyle = {
  height: '90%',
  overflow: 'auto',
}

// components
/**
 * @param menu used to hold the menu items
 * @param order used to hold the order 
 * @param setOrder used to hold the order made
 * @param setTotal used to hold the total of the order
 * @return grid of the menu items and order
 */

const MenuGrid = ({ menu, order, setOrder, setTotal }) => {
  return (
    <div style={gridContainer}>
      {menu.map((item, index) => <MenuElement name={item.menuitem} id={item.food_id} price={item.price} order={order}
        setOrder={setOrder} setTotal={setTotal} key={index} />)}
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

const MenuElement = ({ name, id, price, setOrder, setTotal }) => {
  return <Button id="buttonHoverEffect" style={{ backgroundColor: 'rgba(80, 0, 0, .8)', color: 'white', width: '8vw', height: '6vw' }}
    onClick={(event) => {
      setOrder(current => [...current, id]);
      setTotal(current => current + parseFloat(price));
    }}>{name}</Button>;
}

/**
 * @param order used to hold the order
 * @param menu used to hold the name of the menu items
 * @return order display
 */

const OrderDisplay = ({ order, menu }) => {
  if (menu.length <= 0) return;

  /**
   * @param id used to hold the id of the menu items 
   */
  function findMenuItem(id) {
    for (var i = 0; i < menu.length; ++i) {
      if (menu[i].food_id === id) return menu[i];
    }
  }

  return (
    <div style={orderItemStyle}>
      {order.map((id, index) => <OrderItem item={findMenuItem(id)} key={index} />)}
    </div>
  )
}

/**
 * @param item used to hold the order menu item names
 */
const OrderItem = ({ item }) => {
  return (
    <p><font size="+2">{'$' + item.price + " " + item.menuitem}</font></p>
  )
}


/**
 * @exception Exception if connecting to databse has an error
 * @return the server side GUI
 */
const Server = () => {
  const [menuTable, setMenuTable] = useState([]);
  const [order, setOrder] = useState([]);
  const [total, setTotal] = useState(0.0);

  useEffect(() => {
    axios('https://revsgrill.up.railway.app/manager/menu')
      .then(res => setMenuTable(res.data))
      .catch(err => console.log(err))
  }, []);

  /**
 * @param id used to hold the id of the menu items 
 */
  function findMenuItem(id) {
    for (var i = 0; i < menuTable.length; ++i) {
      if (menuTable[i].food_id === id) return menuTable[i];
    }
  }

  /**
 * @return the details of the menu item chosen
 */
  function createJSON() {
    var res = []
    for (var i = 0; i < order.length; ++i) {
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

  return (
    <div>
      <img src={picture} style={myStyle} alt='Kyle Field' />
      <div style={{position: 'absolute', zIndex: '2'}}>
      <a href='https://revsgrill.onrender.com/?#pills-login'><img src={logo} style={{marginLeft: '10px', height:'60px', width:'60px', borderRadius:'25%'}} alt='Go Home' /></a>
    </div>
      <div style={glassPane}>

        <Card style={inventoryContainerStyle}>
          <Card.Body>
            <Card.Title style={{ textAlign: 'center', color: 'black' }}>
              <font size="+2">Menu Items</font>
            </Card.Title>
            <div class="container my-5">
              <div class="tab-content" id="nav-tabContent">
                <div class="tab-pane fade show active p-3" id="nav-home" role="tabpanel"
                  aria-labelledby='nav-home-tab'>
                  <MenuGrid menu={menuTable} setOrder={setOrder} setTotal={setTotal} />
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card style={checkoutStyle}>
          <Card.Body>
            <Card.Title style={{ textAlign: 'center', color: 'black' }}>
              Current Order
            </Card.Title>
            <Card style={{ height: '90%' }}>
              <Card.Body style={{ height: '1vh' }}>
                <h2 style={{ textAlign: 'center', color: 'black' }}>Total: ${total.toFixed(2)}</h2>
                <OrderDisplay order={order} menu={menuTable} />
                <Button style={{marginLeft: '695px', marginTop: '-1270px', width: '70px', height: '60px', backgroundColor: 'rgba(80, 0, 0, .8)'}} onClick={(event) => {
                  setOrder([]); setTotal(0.00);}}>Clear Order</Button>
              </Card.Body>
            </Card>


            <Button style={{backgroundColor: 'rgba(80, 0, 0, .8)', color: 'white', width: '100%', marginTop: '5px'}} onClick={(event) => {
              axios.post('https://revsgrill.up.railway.app/server/placeorder', createJSON()
              ).then((res) => { setOrder([]); setTotal(0.00); }).catch(err => console.log(err));
            }}>Check Out</Button>

          </Card.Body>
        </Card>

      </div>
    </div>
  )
}

export default Server;


