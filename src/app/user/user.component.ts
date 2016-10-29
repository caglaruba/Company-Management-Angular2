import {Component, OnInit} from "@angular/core";
import {User} from "../models/user";
import {UserService} from "../services/user.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/pluck";
import "rxjs/add/operator/filter";
import {AuthService} from "../services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  templateUrl: 'user.component.html'
})
export class UserComponent implements OnInit {
  userForm: FormGroup;
  loading: boolean = false;
  users: User[];
  selectedUser: User;

  error: string = '';

  constructor(private userService: UserService,
              private router: Router,
              private authService: AuthService,
              private route: ActivatedRoute,
              private fb: FormBuilder) {
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    this.userForm = this.fb.group({
        name: ['', Validators.required],
        email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEXP)])],
        phone: ['', Validators.required],
        is_admin:[''],
      }
    );

  }

  ngOnInit() {
    this.loading = true;

    this.loadUsers();
    this.route.params.subscribe((params: Params) => {
      let id = params['id'];

      if (typeof id != "undefined") {
        this.loadUser(id);
      }
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      resp => {
        this.users = resp;
      },
      err => {
        console.log(err.message);
      }
    );
  }

  loadUser(id: string): void {
    this.userService.getUser(id).subscribe(
      user => {
        this.selectedUser = user;
      },
      err => {
        console.log(err.message);
      }
    );
  }

  selected(value:any):void {
    console.log(value);
    this.selectedUser.company_id = value.id;
  }

  onSelect(user: User): void {
    this.selectedUser = user;
  }

  onRemove(): void {
    this.userService.deleteUser(this.selectedUser.id).subscribe(
      resp => {
        this.users = this.users.filter(item => {
          return item.id === this.selectedUser.id
        });
        delete(this.selectedUser);
        this.router.navigate(['users']);
      },
      err => {
        console.log(err.message);
      }
    );
  }

  onModify(event): void {
    event.preventDefault();

    if (typeof this.selectedUser.id == "undefined" || this.selectedUser.id == "") {
      this.create();
    } else {
      this.update();
    }
  }

  create(): void {
    this.userService.createUser(this.selectedUser).subscribe(
      resp => {
        this.selectedUser.id = resp.id;
        this.users.push(this.selectedUser);
      },
      err => {
        console.error(err);
      }
    );
  }

  update(): void {
    this.userService.updateUser(this.selectedUser).subscribe(
      resp => {
        let index = this.users.findIndex(user => {
          return user.id === this.selectedUser.id
        });
        if (index != -1) {
          this.users[index] = this.selectedUser;
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  onShowCreate(event): void {
    event.preventDefault();
    this.selectedUser = new User;
    this.selectedUser.name = "New user name";
  }
}
