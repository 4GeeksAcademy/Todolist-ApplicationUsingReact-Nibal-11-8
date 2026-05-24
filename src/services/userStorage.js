// Local storage management
export const userStorage = {
  getUsername() {
    let username = localStorage.getItem('todoUsername')
    if (!username) {
      username = 'user_' + Math.random().toString(36).substring(2, 15)
      localStorage.setItem('todoUsername', username)
    }
    return username
  },

  clearUsername() {
    localStorage.removeItem('todoUsername')
  }
}
