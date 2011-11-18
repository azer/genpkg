var kick = require('highkick');

kick({ module:require('./tests'), name:'genpkg' }, function(error, result){
  if(error) throw error;
});
