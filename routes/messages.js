const { ensureLoggedIn } = require("../middleware/auth");




/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get("/:id", ensureLoggedIn, (req, res, next) => {

try {Message.get(id)}
catch (e)
{next(e)}




})



/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post("/", ensureLoggedIn, (req,res, next)=> {
const { from_username, to_username, body } = req.body
    try {Message.create(from_username, to_username, body)        
}
catch(e){next(e)}



}


)




/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

router.post("/:id/read", ensureLoggedIn, (req, res, next)=>{
const { id } = req.params
try {Message.markRead(id)
}
catch(e) {next(e)}

})