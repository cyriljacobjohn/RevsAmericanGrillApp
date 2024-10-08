import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { ReactDOM, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useGoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { useRef, useEffect } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
const picture = new URL("./Resources/KyleField.jpg", import.meta.url)

let fromLangdef = 'en';
let toLangdef = 'en';

// const revsLogo = new URL("./Resources/whiteLogo.png", import.meta.url)
const revsLogo = new URL("./Resources/yellowLogo.png", import.meta.url)

const googleClientId = "862219696784-jgurkbjugk2pm4k1pppsi7ah0o40q0gg.apps.googleusercontent.com"; //process.env.REACT_APP_GOOGLE_CLIENT_ID;
const drfClientId = "ND3FPGhukjq8ayy9ZS2C6Fg4qQM6E4MJNWnopvvH";  //process.env.REACT_APP_DRF_CLIENT_ID;
const drfClientSecret = "VWCCd2uiOAAE6patwl43RBoDvWAkLJ8F3ojoqLlwpHPwuXyhr9xJH3rONst84oxuX9CdEClq6Aw55RMLdpWzk3RJYtVdZt8LbSbJRsnRCheuh8xiJI8H3oeLrbpm4FA9";  //process.env.REACT_APP_DRF_CLIENT_SECRET;


const myStyle = {
  height: '100vh',
  objectFit: 'cover',
  overflow: 'hidden',
  position: 'fixed',
  left: '-18vw',
  top: '0',
  z: '-2'
}

const logoStyle = {
  height: '60vh',
  marginTop: '-2vh'
}

const whitePane = {
  filter: 'dropShadow(30px 10px 4px #4444dd)',
  margin: '5vh auto',
  top: '0',
  right: '0',
  bottom: '0',
  left: '0',

  backdropFilter: 'blur(10px)',
  height: '90vh',
  width: '90vw',
  overflow: 'hidden',
  backgroundColor: 'blue',

}



/**
 * @return full website GUI  
*/
const App = () => {

  //Translate Component
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
  const TranslateText = ({ text }) => {
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
  let navigate = useNavigate();
  
  const navigateToManager = () => {
    navigate("/manager");
  }
  const navigateToServer = () => {
    navigate("/server");
  }
  const navigateToCustomer = () => {
    navigate("/customer");
  }

  /**
   * @param event action event, the button that got pressed
   */
  const loginClick = event => {
    //Sets the login page to be active
    const loginButton = document.getElementById("tab-login");
    loginButton.setAttribute("class", "nav-link active");
    loginButton.setAttribute("style", "background-color:rgb(80,0,0)");
    const loginForm = document.getElementById("pills-login");
    loginForm.setAttribute("class", "tab-pane fade show active");

    // Sets the register pill to be inactive
    const element = document.getElementById("tab-register");
    element.setAttribute("class", "nav-link");
    element.setAttribute("style", "background-color:rgb(255,255,255)");
    const registerForm = document.getElementById("pills-register");
    registerForm.setAttribute("class", "tab-pane fade");

  };

  /**
 * @param event action event, the button that got pressed
 */
  const registerClick = event => {
    //Sets the login page to be inactive
    const loginButton = document.getElementById("tab-login");
    loginButton.setAttribute("style", "background-color:rgb(255,255,255)");
    loginButton.setAttribute("class", "nav-link");
    const loginForm = document.getElementById("pills-login");
    loginForm.setAttribute("class", "tab-pane fade");

    // Sets the register pill to be active
    const element = document.getElementById("tab-register");
    element.setAttribute("class", "nav-link active");
    element.setAttribute("style", "background-color:rgb(80,0,0)");
    const registerForm = document.getElementById("pills-register");
    registerForm.setAttribute("class", "tab-pane fade show active");

  }

  /**
 * @param username name of the user inputted
 * @param password password  of the user inputted
 * @param key given value of manager side or server side
 */
  function createUser(username, password, key) {
    axios.post('https://revsgrill.up.railway.app/login/user', {
      email: username,
      password: password,
      is_auth: false,
      is_manager: key === "manager",
      is_server: key === "server",
      first_name: "None",
      last_name: "None",
    }).then((res) => {
      if (res.data === "Added New User Successfully!") {
        window.location.reload(false);
      } else {
        alert("Failed to create account.")
        //navigateToCustomer();
      }
    })
  }

  /**
* @param username name of the user inputted
* @param password password  of the user inputted
*/
  function loginUser(username, password) {
    axios.get('https://revsgrill.up.railway.app/login/user?email=' + username + '&pass=' + password).then((res) => {
      if (res.data === "Valid User") {
        navigateToCustomer();
      } else if (res.data === "Valid Manager") {
        console.log("idk");
        navigateToManager();
      } else if (res.data === "Valid Server") {
        navigateToServer();
      } else {
        alert("Invalid email and/or password.")
      }
    })
  }

  /**
* @param accessToken given access for customer
*/
  function googleLogin(accessToken) {
    axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    }).then((res) => {
      axios.post('https://revsgrill.up.railway.app/login/user', {
        email: res.data.email,
        first_name: res.data.given_name,
        last_name: res.data.family_name,
        is_auth: true,
      }).then((res) => {
        if (res.data === "Added New User Successfully!") {
          navigateToCustomer();
        } else if (res.data === "User Already Exists!") {
          navigateToCustomer();
        } else {
          alert("Failed to log you in :/")
        }
      })
    })
  }

  /**
* @param response google login response to user
*/
  function responseGoogle(response) {
    googleLogin(response.access_token);
  }

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [key, setKey] = useState("");
  const [Langvar, setLangvar] = useState(toLangdef);

  return (
    <body>
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.8/css/all.css" integrity="sha384-3AB7yXWz4OeoZcPbieVW64vVXEwADiYyAEhwilzWsLw+9FgqpyjjStpPnpBO8o8S" crossorigin="anonymous"></link>
      <img src={picture} style={myStyle} alt='Kyle Field' />
      <section class="skewbox">
        <div class="leftSlanted">

          <img src={revsLogo} style={logoStyle} alt='Revs Logo' />


        </div>

        <div class="rightSlanted">
          <div class="loginContainer ">

            <ul class="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
              <li class="nav-item" role="presentation">
                <a class="nav-link active" id="tab-login" data-mdb-toggle="pill" href="?#pills-login" role="tab"
                  aria-controls="pills-login" aria-selected="true" onClick={loginClick} style={{ backgroundColor: 'rgb(80,0,0)' }}><TranslateText text={'Login'}></TranslateText></a>
              </li>
              <li class="nav-item" role="presentation" >
                <a class="nav-link" id="tab-register" data-mdb-toggle="pill" href="#pills-register" role="tab"
                  aria-controls="pills-register" aria-selected="false" onClick={registerClick} style={{ backgroundColor: 'rgb(255,255,255)' }}><TranslateText text={'Register'}></TranslateText></a>
              </li>
            </ul>

            <div class="tab-content">
              <div class="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="tab-login">
                <form>
                  <div class="text-center mt-4">
                    <p><TranslateText text={'Sign in with:'}></TranslateText></p>

                    <button type="button" aria-label="Sign in with Google" class="btn btn-link btn-floating mx-1" id="googleButton" onClick={useGoogleLogin({
                      onSuccess: tokenResponse => responseGoogle(tokenResponse),
                      // onFailure: navigateToCustomer()
                    })}>
                      <i class="fab fa-google"></i>
                    </button>


                  </div>

                  <p class="text-center mt-1"><TranslateText text={'Or'}></TranslateText></p>

                  <div class="form-outline mb-1 mx-5">
                    <label class="form-label" for="loginName"><TranslateText text={'Username'}></TranslateText></label>
                    <input type="email" id="loginName" class="form-control" style={{display:'flex', textAlign:'Center'}} value={username} onChange={(event) =>
                      setUsername(event.target.value)
                      } />
                  </div>

                  <div class="form-outline mb-1 mx-5">
                    <label class="form-label" for="loginPassword"><TranslateText text={'Password'}></TranslateText></label>
                    <input type="password" id="loginPassword" style={{display:'flex', textAlign:'Center'}} class="form-control" value={password} onChange={(event) =>
                      setPassword(event.target.value)} />
                  </div>

                  <button /*type="submit"*/ class="btn btn-primary btn-block mt-2 border border-white" style={{ backgroundColor: 'rgb(80, 0, 0)' }}
                    onClick={(event) => loginUser(username, password)}><TranslateText text={'Sign In'}></TranslateText></button>
                </form>
              </div>

              <div class="tab-pane fade" id="pills-register" role="tabpanel" aria-labelledby="tab-register">
                <form>
                  <div class="text-center mt-4">
                    <p><TranslateText text={'Sign Up With:'}></TranslateText></p>

                  </div>
                  <div class="form-outline mb-1 mx-5">
                    <label class="form-label" for="registerUsername"><TranslateText text={'Username'}></TranslateText></label>
                    <input type="email" id="registerUsername" style={{display:'flex', textAlign:'Center'}} class="form-control" value={username} onChange={(event) =>
                      {setUsername(event.target.value)}} />
                  </div>

                  <div class="form-outline mb-1 mx-5">
                    <label class="form-label" for="registerPassword"><TranslateText text={'Password'}></TranslateText></label>
                    <input type="password" id="registerPassword" style={{display:'flex', textAlign:'Center'}} class="form-control" value={password} onChange={(event) =>
                      setPassword(event.target.value)} />
                  </div>


                  <div class="form-outline mb-1 mx-5" >
                    <label class="form-label" for="registerRepeatPassword" ><TranslateText text={'Key'}></TranslateText></label>
                    <input style={{display:'flex', textAlign:'Center'}}placeholder="Leave blank if customer" type="password" id="registerRepeatPassword" class="form-control"
                      value={key} onChange={(event) => setKey(event.target.value)} />
                  </div>

                  <button type="submit" class="btn btn-primary btn-block mt-1 border border-white"
                    onClick={(event) => createUser(username, password, key)}><TranslateText text={'Sign Up'}></TranslateText></button>
                </form>
              </div>
            </div>
          </div>

        </div>

      </section>

      <div style={{ position: 'absolute', left: '20px', bottom: '20px' }}>
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
    </body>
  )
}


export default App;
