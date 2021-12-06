const mongoose = require('mongoose');
const connectionDatabase = () =>{
mongoose.connect(process.env.DB_LOCAL_URI,{
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex :true
}).then(con => {console.log('Mongodb database connected with host'+con.connection.host)})
}
module.exports = connectionDatabase;