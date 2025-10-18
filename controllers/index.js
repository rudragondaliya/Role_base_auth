exports.homePage=(req,res)=>{
    return res.render('index');
}

exports.tablePage=(req,res)=>{
    return res.render('./pages/tables')
}

exports.formBasicPage=(req,res)=>{
    return res.render('./pages/form-basic');
}
exports.authenticationLoginPage=(req,res)=>{
    return res.render('./pages/authentication-login');
}
exports.authenticationRegisterPage=(req,res)=>{
    return res.render('./pages/authentication-register');
}