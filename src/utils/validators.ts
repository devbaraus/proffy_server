export function emailValidator(email: string) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).replace(' ', '').toLowerCase())
}

export function passwordValidator(password: string) {
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/
  return re.test(String(password))
}

export function phoneValidator(phone: string) {
  const re = /^\+(?:[0-9] ?){6,14}[0-9]$/
  return re.test(String(phone))
}
