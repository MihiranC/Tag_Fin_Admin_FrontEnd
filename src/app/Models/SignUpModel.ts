export class SignUp {
  password: string| undefined;
  confirmpassword: string| undefined;
  username: string| undefined;
  encryptedpassword: string| undefined;
  encryptedusername: string| undefined;
  isvalid: boolean| undefined;
  userID: number| undefined;

  // password policy
  capitalLetters: string| undefined;
  simpleLetters: string| undefined;
  alphaNumericLetters: string| undefined;
  numaricLetters: string| undefined;

}
