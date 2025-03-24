export function useAuth() {
  async function logIn(username: string, password: string) {
    const res = await fetch('http://localhost:8080/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })

    const body = await res.json()
    if (res.body) {
      sessionStorage.setItem('isLoggedIn', 'true')
      return body
    } else {
      return false
    }
  }
  function logOut() {
    sessionStorage.removeItem('isLoggedIn')
  }

  function isLoggedIn() {
    return sessionStorage.getItem('isLoggedIn') === 'true'
  }
  return { logIn, logOut, isLoggedIn }
}

export type UseAuth = ReturnType<typeof useAuth>
