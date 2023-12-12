/** User class for message.ly */

const { BCRYPT_WORK_FACTOR } = require("../config")
const bcrypt= require("bcrypt")
const db = require('../db')


/** User of the site. */

class User {

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({username, password, first_name, last_name, phone}) { 
      
      const hashedPassword  = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
      const result = await db.query( `INSERT INTO users (username, password, first_name, last_name, phone, join_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING username, password,
      first_name, last_name, phone`, [username, hashedPassword, first_name, last_name, phone, '11/22/23'])
      const user = result.rows[0]
      return user 
    }
  
  
  
  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) { 
    const result = await db.query(`SELECT password FROM users WHERE username = $1`, [username])
      let user = result.rows[0]

      if (user) {
          if (await bcrypt.compare(password, user.password) === true) {
            return {"message": "logged IN! true"
          }

      }
      else {
        return false
      }

  }}

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) { 
    const result = await db.query(`UPDATE users SET last_login_at = $1 WHERE username = $2 RETURNING username`, [ null, username])
    return result.rows


  }

  
  
  
  
  
  
  
  
  
  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() { 


    const results = await db.query(`SELECT username, first_name, last_name, phone from users`)
    return [results.rows[0]]


   }

     /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */
  

  static async get(username) { 


   const results = await db.query(`SELECT username, first_name, last_name, phone, join_at, last_login_at FROM users WHERE username = $1`, [username])
    return results.rows[0]
  }

/** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
 */  
  
  static async messagesFrom(username) { 

    try{
    const results = await db.query(`SELECT id, to_user, body, sent_at, read_at FROM messages WHERE from to_user = $1,` [username])
      return results.rows}
    catch { if (null){
        throw console.log('error')
    }  
    }
    }
  
   /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */
  
  static async messagesTo(username) {
      try {
      const results = await db.query(`SELECT id, from_user, body, sent_at, read_at FROM messsages WHERE from_user = $1` [username])
        return [results.rows]
      }
   catch {
    if (null || undefined) {
      return false
    } 
   }
}

}
module.exports = User;