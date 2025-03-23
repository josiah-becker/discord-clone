export function useAuth() {
  function logIn() {
    sessionStorage.setItem('isLoggedIn', 'true')
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
