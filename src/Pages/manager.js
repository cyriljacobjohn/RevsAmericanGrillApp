import 'bootstrap/dist/css/bootstrap.min.css'
import { Button, Card } from 'react-bootstrap';
import React, {useState} from "react";
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { useEffect } from 'react';
import axios from 'axios';
const picture = new URL("../Resources/KyleField.jpg", import.meta.url);
const logo = new URL("../Resources/yellowLink.jpg", import.meta.url);


//Style for the Kyle Field BG
const backgroundStyle = {
  height: '100vh',
  objectFit: 'cover',
  overflow: 'hidden',
  position: 'fixed',
  left: '-18vw',
  top: '0',
  z: '-2'
}

const glassPane = {
  //Positioning
  position: 'relative',
  margin: '5vh auto',
  top: '0',
  right: '0',
  bottom: '0',
  left:'0',
  height: '90vh',
  width: '90vw',
  overflow: 'hidden', 
  borderRadius: '20px',

  //Glass Effect
  backgroundColor: 'rgba(90, 90, 90, .15)',   
  backdropFilter: 'blur(5px)',
  
  //Grid layout
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '2vw',
  gridAutoRows: 'minmax(100px, auto)',
  padding: '1%',
}

//Containers
const menuItemsStyle = {
  width: '100%',
  alignItems: 'center',
  gridColumn: '1',
  gridRow: '1',
}
const inventoryItemsStyle = {
  width: '100%',
  alignItems: 'center',
  gridColumn: '1',
  gridRow: '2',
}
const reportStyle = {
  position: 'relative',
  width: '100%',
  height: '100%',
  gridRow: '1/3',
  gridColumn: '2',
}
const formStyle = {
  width: '100%',
}
const menuTableContainer = {
  height: '17.5%',
  width: '42.5vw',
  paddingRight: '3px',
  overflow: 'auto',
}
const inventoryTableContainer = {
  height: '12.75%',
  width: '42.5vw',
  paddingRight: '3px',
  overflow: 'auto',
}
const reportItemStyle = {
  // backgroundColor: 'yellow',
  height: '100%',
  overflow: 'auto',
}


//Components (should probably be in another file, but oh well)

/**
 * 
 * @param item Inventory item from database
 * @returns all the information of the inventory item in a specifc row
 */

const InventoryTableRow = ({item}) => {
  return (
    <tr>
      <td>{item.item_id}</td>
      <td>{item.itemname}</td>
      <td>{item.itemcount}</td>
      <td>{item.itemfcount}</td>
      <td>{item.itemcode}</td>
    </tr>
  )
}

/**
 * 
 * @param menu The container with the menu items
 * @returns the menu table with all the information of a menu item
 */

const MenuTable = ({menu}) => {
  return (
    // Delete the card
    <div style={menuTableContainer}>
      <Table striped bordered hover style={{overflow: 'hidden'}}>
          <thead>
            <tr>
              <th>Food ID</th>
              <th>Item Name</th>
              <th>Price</th>
              <th>Ingredients</th>
            </tr>
          </thead>
          <tbody >
            {menu.map((item, index) => <MenuTableRow item={item} key={index}/>)}
          </tbody>
        </Table>
      </div>
    
    )
}
/**
 * 
 * @param inventory The container with all the inventory items
 * @returns the inventory table with all the information of an inventory item
 */

const InventoryTable = ({inventory}) => {
  return (
    // Delete the card
    <div style={inventoryTableContainer}>
      <Table striped bordered hover style={{overflow: 'hidden'}}>
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Item Name</th>
            <th>Item Count</th>
            <th>Item Capacity</th>
            <th>Item Code</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item, index) => <InventoryTableRow item={item} key={index}/>)}
        </tbody>
        </Table>
    </div>
  )
}
/**
 * 
 * @param item Menu item in a specifc row
 * @returns all the information of a menu item in a row
 */

const MenuTableRow = ({item}) => {
  return (
    <tr>
      <td>{item.food_id}</td>
      <td>{item.menuitem}</td>
      <td>{item.price}</td>
      <td>{item.ingredients}</td>
    </tr>
  )
}

/**
 * 
 * @param reportType the type of the report that we want to generate 
 * @param item used to hold the order menu item name
 * @return chosen report data
 */

const ReportRow = ({reportType, item}) => {
  if(reportType === "salesreport"){
    var data = item.menuItem + " sold " + item.amountSold 
    + " time(s) for $" + item.totalRevenue;
    return (
      <p>{data}</p>
    )
  }else if(reportType === "restockreport"){
    var data = item.item + " has a low level of only " + item.level + " left.";
    return (
      <p>{data}</p>
    )
  }else if(reportType === "excessreport"){
    var data = "";
    if(item.amountSold === 0){
      data = item.item + " was not sold at all.";
    }else{
      data = item.item + " was only sold " + item.amountSold + " times.";
    }
    return (
      <p>{data}</p>
    )
  }else if(reportType === "comboreport"){
    var data = item.combo + ": " + item.count;
    return (
      <p>{data}</p>
    )
  }
}

/**
 * 
 * @param reportType the type of the report that we want to generate
 * @param data the data generated from the chosen report
 * @param loading indicate that the report is loading
 * @return the report generated
 */

const Report = ({reportType, data, loading}) => {
  if(loading){
    return (<h1>Loading...</h1>)
  }else{
    return (
      <div style={reportItemStyle}>
        {data.map((item, index) => <ReportRow reportType={reportType} item={item} key={index}/>)}
      </div>
    )
  }
}
/**
 * @exception exception if connecting to databse has an error
 * @returns the manager side interface
 */

const Manager = () => {
  const [menuTable, setMenuTable] = useState([]);
  const [inventoryTable, setInventoryTable] = useState([]);
  const [reportType, setReportType] = useState("salesreport");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [menuIDAdd, setMenuIDAdd] = useState("");
  const [menuNameAdd, setMenuNameAdd] = useState("");
  const [menuPriceAdd, setMenuPriceAdd] = useState("");
  const [menuIngsAdd, setMenuIngsAdd] = useState("");

  const [menuIDEdit, setMenuIDEdit] = useState("");
  const [menuNameEdit, setMenuNameEdit] = useState("");
  const [menuPriceEdit, setMenuPriceEdit] = useState("");
  const [menuIngsEdit, setMenuIngsEdit] = useState("");

  const [menuIDRemove, setMenuIDRemove] = useState("");

  const [invIDAdd, setInvIDAdd] = useState("");
  const [invNameAdd, setInvNameAdd] = useState("");
  const [invCountAdd, setInvCountAdd] = useState("");
  const [invCapAdd, setInvCapAdd] = useState("");
  const [invCodeAdd, setInvCodeAdd] = useState("");

  const [invIDEdit, setInvIDEdit] = useState("");
  const [invNameEdit, setInvNameEdit] = useState("");
  const [invCountEdit, setInvCountEdit] = useState("");
  const [invCapEdit, setInvCapEdit] = useState("");
  const [invCodeEdit, setInvCodeEdit] = useState("");


  const [invIDRemove, setInvIDRemove] = useState("");

  var reportString = 'https://revsgrill.up.railway.app/manager/'+reportType+'?start='+'"'+startTime+'"'+'&end='+'"'+endTime+'"';

  function updateMenu(){
    axios.get('https://revsgrill.up.railway.app/manager/menu').then(res => setMenuTable(res.data));
  }

  function updateInventory(){
    axios.get('https://revsgrill.up.railway.app/manager/inventory').then(res => setInventoryTable(res.data));
  }

  /**
   * @exception error in displaying the menu table
   */

  useEffect(() => {
    axios('https://revsgrill.up.railway.app/manager/menu')
      .then(res => setMenuTable(res.data))
      .catch(err => console.log(err))
  }, []);

  /**
   * @exception error in outputting the inventory table
   */

  useEffect(() => {
    axios('https://revsgrill.up.railway.app/manager/inventory')
      .then(res => setInventoryTable(res.data))
      .catch(err => console.log(err))
  }, []);

  return (
    <div>
      <img src={picture} style={backgroundStyle} alt='Kyle Field'/>
      <div style={{position: 'absolute', zIndex: '2'}}>
      <a href='https://revsgrill.onrender.com/?#pills-login'><img src={logo} style={{marginLeft: '10px', height:'60px', width:'60px', borderRadius:'25%'}} alt='Go Home' /></a>
    </div>
        <div style={glassPane}>
          <Card style={menuItemsStyle}>
            <Card.Body>
              <Card.Title style={{textAlign:'center'}}>
                Menu Items
              </Card.Title>
              <MenuTable menu={menuTable}/>
              
              {/* Add item row */}
              <Row className="align-items-center" style={{justifyContent: 'center', alignItems: 'center', marginTop:'8px'}}>
                  <Col>
                    <InputGroup className="mb-2">
                      <InputGroup.Text ><small>Food ID:</small></InputGroup.Text>
                      <Form.Control id="inlineFormInputGroup" value={menuIDAdd} onChange={(event) => setMenuIDAdd(event.target.value)}/>
                    </InputGroup>
                  </Col>
                  <Col>
                    <InputGroup className="mb-2">
                      <InputGroup.Text ><small>Item name:</small></InputGroup.Text>
                      <Form.Control id="inlineFormInputGroup" value={menuNameAdd} onChange={(event) => setMenuNameAdd(event.target.value)}/>
                    </InputGroup>
                  </Col>
                  <Col>
                    <InputGroup className="mb-2">
                      <InputGroup.Text ><small>Price:</small></InputGroup.Text>
                      <Form.Control id="inlineFormInputGroup" value={menuPriceAdd} onChange={(event) => setMenuPriceAdd(event.target.value)}/>
                    </InputGroup>
                  </Col>
                  <Col>
                    <InputGroup className="mb-2">
                      <InputGroup.Text ><small>Ingredients:</small></InputGroup.Text>
                      <Form.Control id="inlineFormInputGroup" value={menuIngsAdd} onChange={(event) => setMenuIngsAdd(event.target.value)}/>
                    </InputGroup>
                  </Col>
                  <Col>
                    <InputGroup className="mb-2">
                      <button type="button" class="btn btn-outline-secondary" onClick={(event) => {
                      axios.post('https://revsgrill.up.railway.app/manager/menu', {
                        menuitem: menuNameAdd,
                        price: menuPriceAdd,
                        ingredients: menuIngsAdd
                      }).then((res) => {updateMenu(); setMenuIDAdd(""); setMenuIngsAdd(""); setMenuNameAdd(""); setMenuPriceAdd("")})
                      .catch(err => {alert("Error processing request."); setMenuIDAdd(""); setMenuIngsAdd(""); setMenuNameAdd(""); setMenuPriceAdd("")});
                      }}><small>Add item</small></button>
                    </InputGroup>
                  </Col>
                </Row>

                {/* Edit Item Row */}
                <Row className="align-items-center" style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Col>
                    <InputGroup className="mb-2">
                      <InputGroup.Text ><small>Food ID:</small></InputGroup.Text>
                      <Form.Control id="inlineFormInputGroups" value={menuIDEdit} onChange={(event) => setMenuIDEdit(event.target.value)}/>
                    </InputGroup>
                  </Col>
                  <Col>
                    <InputGroup className="mb-2">
                      <InputGroup.Text ><small>Item name:</small></InputGroup.Text>
                      <Form.Control id="inlineFormInputGroup" value={menuNameEdit} onChange={(event) => setMenuNameEdit(event.target.value)}/>
                    </InputGroup>
                  </Col>
                  <Col>
                    <InputGroup className="mb-2">
                      <InputGroup.Text ><small>Price:</small></InputGroup.Text>
                      <Form.Control id="inlineFormInputGroup" value={menuPriceEdit} onChange={(event) => setMenuPriceEdit(event.target.value)}/>
                    </InputGroup>
                  </Col>
                  <Col>
                    <InputGroup className="mb-2">
                      <InputGroup.Text ><small>Ingredients:</small></InputGroup.Text>
                      <Form.Control id="inlineFormInputGroup" value={menuIngsEdit} onChange={(event) => setMenuIngsEdit(event.target.value)}/>
                    </InputGroup>
                  </Col>
                  <Col style={{display: 'flex', justifyContent: 'right'}}>
                    <InputGroup className="mb-2">
                      <button type="button" class="btn btn-outline-secondary" onClick={(event) => {
                      axios.put('https://revsgrill.up.railway.app/manager/menu', {
                        food_id: menuIDEdit,
                        menuitem: menuNameEdit,
                        price: menuPriceEdit,
                        ingredients: menuIngsEdit
                      }).then((res) => {updateMenu(); setMenuIDEdit(""); setMenuIngsEdit(""); setMenuNameEdit(""); setMenuPriceEdit("");})
                      .catch(err => {alert("Error processing request."); setMenuIDEdit(""); setMenuIngsEdit(""); setMenuNameEdit(""); setMenuPriceEdit("");});
                      }}><small>Edit Item</small></button>
                    </InputGroup>
                  </Col>
                </Row>

                {/* Remove item row */}
                <Row className="align-items-center" style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Col >
                    <InputGroup className="mb-2">
                      <InputGroup.Text ><small>Food ID:</small></InputGroup.Text>
                      <Form.Control id="inlineFormInputGroup" value={menuIDRemove} onChange={(event) => setMenuIDRemove(event.target.value)}/>
                    </InputGroup>
                  </Col>
                  <Col>
                    <InputGroup className="mb-2">
                      <button type="button" class="btn btn-outline-secondary" onClick={(event) => {
                      axios.delete('https://revsgrill.up.railway.app/manager/menu/' + menuIDRemove).then((res) => {updateMenu(); setMenuIDRemove("");})
                      .catch(err => {alert("Error processing request."); setMenuIDRemove("");});
                      }}><small>Remove item</small></button>
                    </InputGroup>
                  </Col>
                </Row>
              
            </Card.Body>
          </Card>
          
          <Card style={reportStyle}>
            <Card.Body>
            <Card.Title style={{textAlign:'center'}}>
                Reports
            </Card.Title>
            &nbsp;
            <Card style={{height:'75%'}}>
              <Card.Body style={{height:'1vh', backgroundColor:''}}>
                <Report reportType={reportType} data={data} loading={loading}/>
              </Card.Body>
            </Card>
            &nbsp;
            <div style={formStyle}>
              <Form>
                <Row className="align-items-center">
                  <Col xs="100%">
                    <Form.Select aria-label="Default select example" style={{textAlign: 'center'}} 
                      value={reportType} 
                      onChange={(event) => {setReportType(event.target.value); setData([]);}}>
                          <option value={"salesreport"}>Sales Report</option>
                          <option value={"restockreport"}>Restock Report</option>
                          <option value={"excessreport"}>Excess Report</option>
                          <option value={"comboreport"}>Combo Report</option>
                    </Form.Select>
                  </Col>
                </Row>
                &nbsp;
                <Row className="align-items-center" style={{justifyContent: 'center'}}>
                  <Col xs="auto" style={{width: '40%'}}>
                    <Form.Label htmlFor="inlineFormInput" visuallyHidden>
                      Name
                    </Form.Label>
                    <InputGroup className="mb-2">
                      <InputGroup.Text >Start:</InputGroup.Text>
                      <Form.Control id="inlineFormInputGroup" placeholder="MM/DD/YYYY" 
                        value={startTime} onChange={(event) => setStartTime(event.target.value)}/>
                    </InputGroup>
                  </Col>
                  <Col xs="auto" style={{width: '40%'}}>
                    <Form.Label htmlFor="inlineFormInputGroup" visuallyHidden>
                      Username
                    </Form.Label>
                    <InputGroup className="mb-2">
                      <InputGroup.Text>End:</InputGroup.Text>
                      <Form.Control id="inlineFormInputGroup" placeholder="MM/DD/YYYY"
                        value={endTime} onChange={(event) => setEndTime(event.target.value)}/>
                    </InputGroup>
                  </Col>
                  <Col xs="auto">
                    {/* type="submit"  */}
                    <InputGroup className="mb-2">
                    <button  className="mb-2" type="button" class="btn btn-outline-secondary"onClick={(event) => {
                      setLoading(true);
                      axios.get(reportString).then((res) => {
                        if(res.data === "Invalid date/time(s) provided."){
                          setLoading(false)
                        }
                        else{
                          setData(res.data); setLoading(false)
                        }
                      });
                      }}>
                      Submit
                    </button>
                    </InputGroup>
                  </Col>
                </Row>
              </Form>
            </div>
            
            </Card.Body>
          </Card>

          <Card style={inventoryItemsStyle}>
            <Card.Body>
              <Card.Title style={{textAlign:'center'}}>
                Inventory Items
              </Card.Title>
              <InventoryTable inventory={inventoryTable}/>
              <Row className="align-items-center" style={{justifyContent: 'center', alignItems: 'center', marginTop:'8px'}}>
              <Col >
                    <InputGroup className="mb-2">
                      <InputGroup.Text ><small>ID:</small></InputGroup.Text>
                      <Form.Control id="inlineFormInputGroup" value={invIDAdd} onChange={(event) => setInvIDAdd(event.target.value)}/>
                    </InputGroup>
                  </Col>
                  <Col>
                    <InputGroup className="mb-2">
                      <InputGroup.Text ><small>Name:</small></InputGroup.Text>
                      <Form.Control id="inlineFormInputGroup" value={invNameAdd} onChange={(event) => setInvNameAdd(event.target.value)}/>
                    </InputGroup>
                  </Col>
                  <Col>
                    <InputGroup className="mb-2">
                      <InputGroup.Text ><small>Count:</small></InputGroup.Text>
                      <Form.Control id="inlineFormInputGroup" value={invCountAdd} onChange={(event) => setInvCountAdd(event.target.value)}/>
                    </InputGroup>
                  </Col>
                  <Col>
                    <InputGroup className="mb-2">
                      <InputGroup.Text ><small>Cap:</small></InputGroup.Text>
                      <Form.Control id="inlineFormInputGroup" value={invCapAdd} onChange={(event) => setInvCapAdd(event.target.value)}/>
                    </InputGroup>
                  </Col>
                  <Col>
                    <InputGroup className="mb-2">
                      <InputGroup.Text ><small>Code:</small></InputGroup.Text>
                      <Form.Control id="inlineFormInputGroup" value={invCodeAdd} onChange={(event) => setInvCodeAdd(event.target.value)}/>
                    </InputGroup>
                  </Col>
                  <Col>
                    <InputGroup className="mb-2">
                      <button type="button" class="btn btn-outline-secondary" onClick={(event) => {
                      axios.post('https://revsgrill.up.railway.app/manager/inventory', {
                        itemname: invNameAdd,
                        itemcount: invCountAdd,
                        itemfcount: invCapAdd,
                        itemcode: invCodeAdd
                      }).then((res) => {updateInventory(); setInvCapAdd(""); setInvCodeAdd(""); setInvCountAdd(""); setInvIDAdd(""); setInvNameAdd("")})
                      .catch(err => {alert("Error processing request."); setInvCapAdd(""); setInvCodeAdd(""); setInvCountAdd(""); setInvIDAdd(""); setInvNameAdd("")});
                      }}><small>Add item</small></button>
                    </InputGroup>
                  </Col>
                </Row>

                {/* Edit Item Row */}
                <Row className="align-items-center" style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Col >
                    <InputGroup className="mb-2">
                      <InputGroup.Text ><small>ID:</small></InputGroup.Text>
                      <Form.Control id="inlineFormInputGroup" value={invIDEdit} onChange={(event) => setInvIDEdit(event.target.value)}/>
                    </InputGroup>
                  </Col>
                  <Col>
                    <InputGroup className="mb-2">
                      <InputGroup.Text ><small>Name:</small></InputGroup.Text>
                      <Form.Control id="inlineFormInputGroup" value={invNameEdit} onChange={(event) => setInvNameEdit(event.target.value)}/>
                    </InputGroup>
                  </Col>
                  <Col>
                    <InputGroup className="mb-2">
                      <InputGroup.Text ><small>Count:</small></InputGroup.Text>
                      <Form.Control id="inlineFormInputGroup" value={invCountEdit} onChange={(event) => setInvCountEdit(event.target.value)}/>
                    </InputGroup>
                  </Col>
                  <Col>
                    <InputGroup className="mb-2">
                      <InputGroup.Text ><small>Cap:</small></InputGroup.Text>
                      <Form.Control id="inlineFormInputGroup" value={invCapEdit} onChange={(event) => setInvCapEdit(event.target.value)}/>
                    </InputGroup>
                  </Col>
                  <Col>
                    <InputGroup className="mb-2">
                      <InputGroup.Text ><small>Code:</small></InputGroup.Text>
                      <Form.Control id="inlineFormInputGroup" value={invCodeEdit} onChange={(event) => setInvCodeEdit(event.target.value)}/>
                    </InputGroup>
                  </Col>
                  <Col>
                    <InputGroup className="mb-2">
                      <button type="button" class="btn btn-outline-secondary" onClick={(event) => {
                      axios.put('https://revsgrill.up.railway.app/manager/inventory', {
                        item_id: invIDEdit,
                        itemname: invNameEdit,
                        itemcount: invCountEdit,
                        itemfcount: invCapEdit,
                        itemcode: invCodeEdit
                      }).then((res) => {updateInventory(); setInvCapEdit(""); setInvCodeEdit(""); setInvCountEdit(""); setInvIDEdit(""); setInvNameEdit("")})
                      .catch(err => {alert("Error processing request."); setInvCapEdit(""); setInvCodeEdit(""); setInvCountEdit(""); setInvIDEdit(""); setInvNameEdit("")});
                      }}><small>Edit Item</small></button>
                    </InputGroup>
                  </Col>
                </Row>

                {/* Remove item row */}
                <Row className="align-items-center" style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Col >
                    <InputGroup className="mb-2">
                      <InputGroup.Text ><small>Food ID:</small></InputGroup.Text>
                      <Form.Control id="inlineFormInputGroup" value={invIDRemove} onChange={(event) => setInvIDRemove(event.target.value)}/>
                    </InputGroup>
                  </Col>
                  <Col>
                    <InputGroup className="mb-2">
                      <button type="button" class="btn btn-outline-secondary" onClick={(event) => {
                      axios.delete('https://revsgrill.up.railway.app/manager/inventory/' + invIDRemove).then((res) => {updateInventory(); setInvIDRemove("")})
                      .catch(err => {alert("Error processing request."); setInvIDRemove("")});
                      }}><small>Remove item</small></button>
                    </InputGroup>
                  </Col>
                </Row>
            </Card.Body>
          </Card>
        </div>
    </div>
    )
}

export default Manager;