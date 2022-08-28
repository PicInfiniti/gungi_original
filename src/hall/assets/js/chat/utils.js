export class fakeAccount {
  constructor() {
    this.getId = makeid(21)
    this.getName = 'Siavash Moghadas'
    this.getGivenName = makeid(6)
    this.getFamilyName = 'Moghadas'
    this.getImageUrl = 'https://lh3.googleusercontent.com/a-/AFdZucqPnBxSS9ppBtdCZu4c-CFHRiOEuAhMpaqGKgLJ=s96-c'
    this.getEmail = `${makeid(17)}@gmail.com`
  }
}

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}
