interface address {
  state?: string;
  country: string;
  city: string;
  street: string;
  houseNumber: number;
  zip: number;
}

interface name {
  first: string;
  last: string;
}

interface user {
  _id?: number;
  name: name;
  address: address;
  phone: string;
  email: string;
  password: string;
  isBusiness: boolean;
  isAdmin: boolean;
}

class User {
  #id: number | void;
  #name: string;
  address: address;
  #phone: string;
  #email: string;
  #password: string;
  #createdAt: Date;
  #isAdmin: boolean = false;
  #isBusiness: boolean = false;

  constructor(user: user, users: Array<user> = []) {
    const { email, address, isAdmin, isBusiness, name, password, phone } = user;
    const { first, last } = name;
    this.address = address;
    this.#id = this.generateUniqId(users);
    this.#name = this.setName(first, last);
    this.#phone = this.checkPhone(phone);
    this.#email = this.checkEmail(email, users);
    this.#password = this.checkPassword(password);
    this.#isBusiness = isBusiness;
    this.#isAdmin = isAdmin;
    this.#createdAt = new Date();
  }

  randomNumBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  generateUniqId(users: Array<user> = []): number | void {
    const random = this.randomNumBetween(1_000_000, 9_999_999);
    const user = users.findIndex((user: user) => user._id === random);
    if (user === -1) return random;
    this.generateUniqId(users);
  }

  makeFirstLetterCapital(string: string): string {
    const term: string = string.toLowerCase().trim();
    return term.charAt(0).toUpperCase() + term.slice(1);
  }

  setName(first: string, last: string): string {
    const firstName = this.makeFirstLetterCapital(first);
    const lastName = this.makeFirstLetterCapital(last);
    return `${firstName} ${lastName}`;
  }

  changeBusinessStatus(): void {
    this.#isBusiness = !this.#isBusiness;
  }

  checkPhone(phoneNumber: string): string {
    if (
      phoneNumber.match(/^0[0-9]{1,2}(\-?|\s?)[0-9]{3}(\-?|\s?)[0-9]{4}/g) ===
      null
    ) {
      throw new Error("Please enter a valid phone number!");
    }
    return phoneNumber;
  }

  checkPassword(password: string): string {
    if (
      password.match(
        /((?=.*\d{1})(?=.*[A-Z]{1})(?=.*[a-z]{1})(?=.*[!@#$%^&*-]{1}).{7,20})/g
      ) === null
    )
      throw new Error(
        "The password must contain at least one uppercase letter in English. One lowercase letter in English. Four numbers and one of the following special characters !@#$%^&*-"
      );
    return password;
  }

  checkEmail(email: string, users: Array<user> = []): string {
    if (email.match(/.+@.+\..{2,}/g) === null) {
      throw new Error("Please enter a standard email");
    }
    const user = users.findIndex((user) => user.email === email);
    if (user !== -1) throw new Error("User is already registered!");
    return email;
  }

  get _id(): number | void {
    return this.#id;
  }

  get _name(): string {
    return this.#name;
  }

  get email(): string {
    return this.#email;
  }

  get password(): string {
    return this.#password;
  }

  get createdAt(): Date {
    return this.#createdAt;
  }

  get isAdmin(): boolean {
    return this.#isAdmin;
  }

  get isBusiness(): boolean {
    return this.#isBusiness;
  }
  get phone(): string {
    return this.#phone;
  }

  set phone(phone: string) {
    this.#phone = this.checkPhone(phone);
  }

  set isBusiness(biz: boolean) {
    this.#isBusiness === biz;
  }

  set name({ first, last }: name) {
    this.#name = this.setName(first, last);
  }
}

const firstUser = new User({
  name: { first: "regular", last: "user" },
  address: {
    state: "USA",
    country: "big",
    city: "New York",
    street: "52",
    houseNumber: 109,
    zip: 562145,
  },
  phone: "050-0000000",
  email: "user@gmail.com",
  password: "Aa1234!",
  isBusiness: false,
  isAdmin: false,
});

const secondUser = new User({
  name: { first: "guy", last: "aly" },
  address: {
    state: "USA",
    country: "big",
    city: "New York",
    street: "52",
    houseNumber: 109,
    zip: 562145,
  },
  phone: "050-8888888",
  email: "guy@gmail.com",
  password: "Guy1234!",
  isBusiness: false,
  isAdmin: false,
});

let users: Array<User> = [firstUser, secondUser];

firstUser.changeBusinessStatus();

// DOM TASK//
const EMAIL_INPUT = document.getElementById("email-input") as HTMLInputElement;
const EMAIL_ERRORS = document.getElementById("email-errors") as HTMLSpanElement;

const PASSWORD_INPUT = document.getElementById(
  "password-input"
) as HTMLInputElement;
const PASSWORD_ERRORS = document.getElementById(
  "password-errors"
) as HTMLSpanElement;
const BTN = document.getElementById("btn") as HTMLSpanElement;
const BTN_CANCEL = document.getElementById("btn-cancel") as HTMLSpanElement;
const RESULT = document.getElementById("result") as HTMLSpanElement;

// login //

// CLICS//
BTN.addEventListener("click", () =>
  handleLogin(users, EMAIL_INPUT.value, PASSWORD_INPUT.value)
);
BTN_CANCEL.addEventListener("click", () => cleanInputValue());

// clean input method//
const cleanInputValue = (): void => {
  EMAIL_INPUT.value = "";
  PASSWORD_INPUT.value = "";

  PASSWORD_ERRORS.innerHTML = "";
};

//login listeners //
const loginListeners = () => {
  EMAIL_INPUT.addEventListener("input", (e) => {
    input: e.target;
  });
  PASSWORD_INPUT.addEventListener("input", (e) => {
    input: e.target;
  });
};

const handleLogin = (users: Array<User>, email: string, password: string) => {
  loginListeners();
  if (!users.length) throw new Error("You are not registered please signup!");
  const user = users.find(
    (user) => user.email === email && user.password === password
  );
  if (!user)
    return (PASSWORD_ERRORS.innerHTML = "User mail or password is incorrect!");

  RESULT.innerHTML = "User found. contenting.. Please Wait";
  cleanInputValue();
  return;
};
