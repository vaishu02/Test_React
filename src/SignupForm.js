
import React, {component} from 'react'
import InputField from './InputField';
import SubmitButton from './SubmitButton';
import UserStore from './stores/UserStore';
import LoginForm from './LoginForm';
import {
  Route,
  Switch,
  NavLink,
  Link,
  HashRouter
} from 'react-router-dom';


class SignupForm extends React.Component {   
  constructor(props){
    super(props);
      this.state={
        username: '',
        password: '',
        buttonDisabled: false,
        //isActive:false
      }
  }
/*
  handleShow = () => {
    this.setState({isActive: true});
  };

  handleHide = () => {
    this.setState({isActive: false});
  };
*/
  setInputValue(property,val){
    val=val.trim();
    if(val.length>12){
      return;
    }
    this.setState({
      [property]: val
    })
  }  
    
  resetForm(){
    this.setState({
      username: '',
      password: '',
      buttonDisabled: false
    
    })
  }

  async doSignup(){
    debugger;
    if(this.state.username=='' || this.state.password==''){
      return false;
    }
    if (!this.state.username){
      return;
    }
    if (!this.state.password){
      return;
    }
    this.setState({
      buttonDisabled: true
    })

    try{
      let res=await fetch('/signup',{
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password
        })
      });

      let result = await res.json();
      if(result && result.success){
        UserStore.isLoggedIn=false;
        this.resetForm();
        alert(result.msg);
        //UserStore.username=result.username;
      }
      else if(result && result.success === false){
        this.resetForm();
        alert(result.msg);
      }

    }
    catch(e){
      console.log(e);
      this.resetForm();
    }

  }

  render(){

    //if(this.state.isActive===false){
      return(
        <div>
                <div className="signupForm">
                  
                    Sign-up
                    <InputField
                        type='text'
                        placeholder='Username'
                        value={this.state.username ? this.state.username : ''}
                        onChange={ (val) => this.setInputValue('username',val)}
                        
                    />
                    <InputField
                        type='password'
                        placeholder='Password'
                        value={this.state.password ? this.state.password : ''}
                        onChange={ (val) => this.setInputValue('password',val)}
                    
                    />
                    <SubmitButton
                      text='Sign-up'
                      disabled={this.state.buttonDisabled}
                      onClick={ () => this.doSignup() }
                    />
   
                </div>
        

              <div><Link to='/LoginForm'>Login</Link></div>  
          </div>
         
      );
    }   
}         
  
export default SignupForm;



