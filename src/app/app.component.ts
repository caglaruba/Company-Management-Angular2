import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "./services/index";

@Component({
  selector: 'app',
  templateUrl: 'app.component.html'
})

export class AppComponent implements OnInit {
  public notificationOptions = {
    timeOut: 5000,
    lastOnBottom: true
  };

  constructor(private router: Router,
              private authService: AuthService) {

  }

  ngOnInit() {

  }

  get userName(): string {
    if (this.authService.loggedIn()) {
      return this.authService.getCurrentUserName();
    }

    return "";
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
