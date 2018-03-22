import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register'
import { NavController, LoadingController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { WordpressService } from '../../services/wordpress.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  login_form: FormGroup;
  error_message: string;
  pet: string = "main";
  tab:any;
  register_form: FormGroup;

  images = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg', '11.jpg'];

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public formBuilder: FormBuilder,
    public wordpressService: WordpressService,
    public authenticationService: AuthenticationService
  ) {this.tab = this.navCtrl.parent;}

  ionViewWillLoad() {
    let loading = this.loadingCtrl.create();
    loading.present();
    this.login_form = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.required
      ])),
      password: new FormControl('', Validators.required)
    });
    this.register_form = this.formBuilder.group({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      displayName: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
    });
    loading.dismiss();
  }
  onSubmit(values){
    var username: 'aa'; // this should be an administrator Username
    var password: 'aa'; // this should be an administrator Password
    //only authenticated administrators can create users
    this.authenticationService.doLogin(username, password)
    .subscribe(
      res => {
        let user_data = {
          username: values.username,
          name: values.displayName,
          email: values.email,
          password: values.password
        };
        this.authenticationService.doRegister(user_data, res.json().token)
        .subscribe(
          result => {
            console.log(result);
          },
          error => {
            console.log(error);
          }
        );
      },
      err => {
        console.log(err);
      }
    )
  }

  login(value){
    let loading = this.loadingCtrl.create();
    loading.present();

    this.authenticationService.doLogin(value.username, value.password)
    .subscribe(res => {
  

       loading.dismiss();
       this.navCtrl.setRoot(HomePage);
     },
     err => {
       loading.dismiss();
       this.error_message = "Wrong username or password. Try again or click Forgot password.";
       console.log(err);
     })
  }

  skip(){
    this.tab.select(1);
  }

  goToRegister(){
    this.navCtrl.push(RegisterPage);
  }

}
