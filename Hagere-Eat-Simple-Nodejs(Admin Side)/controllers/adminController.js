var randtoken = require('rand-token');
var nodemailer = require('nodemailer');
const csvtojson = require('csvtojson');
var Json2csvParser = require('json2csv').Parser;
const fs=require('fs');
const formidable=require('formidable');
const { validationResult } = require("express-validator");
const encrypt = require('../lib/hashing');
const sendMail = require('../lib/sendEmail');
const { uploadImage, uploadCSVFile } = require('../lib/fileUpload');
const dbConn = require("../config/db_Connection")
const path=require('path');
const { query } = require('express');
const today = new Date();
const year = today.getFullYear();
const month = ("0" + (today.getMonth()+1)).slice(-2)
const date = ("0" + today.getDate()).slice(-2)
const today_date = year + '-' + month +'-'+ date;
var pdf = require('html-pdf');	

exports.suspendedVendors = (req, res, next) => {
   var query1;
	if (req.method == 'GET')
	{
			query1 = "SELECT customer.username,email,phone,Rname,location,about,logo,active from customer inner join resturant on customer.username=resturant.username and active=0"

	}
    dbConn.query(query1, async (error, result)=>{
		
		if(error)
		{
			console.log (error);
			throw error;
		}
    res.render("pages/suspended_vendors", {data : result, title:'Active Vendors'});
	
	});
    
};
exports.activeVendors = (req, res, next) => {
    var query1;
	if (req.method == 'GET')
	{
			query1 = "SELECT customer.username,email,phone,Rname,location,about,logo,active from customer inner join resturant on customer.username=resturant.username and active=1"

	}
    dbConn.query(query1, async (error, result)=>{
		
		if(error)
		{
			console.log (error);
			throw error;
		}
    res.render("pages/admin_index", {data : result, title:'Active Vendors'});
	
	});
};
exports.activeCustumers = (req, res, next) => {
	var query1;
	if (req.method == 'GET')
	{
			query1 = "select username,email,phone,fname,lname from customer where flag=2 and active=1;";

	}
    dbConn.query(query1, async (error, result)=>{
		
		if(error)
		{
			console.log (error);
			throw error;
		}
    res.render("pages/active_customers", {data : result, title:'Active Vendors'});
	
	});
};
exports.suspendedCustumers = (req, res, next) => {
	var query1;
	if (req.method == 'GET')
	{
			query1 = "select username,email,phone,fname,lname from customer where flag=2 and active=0;";

	}
    dbConn.query(query1, async (error, result)=>{
		
		if(error)
		{
			console.log (error);
			throw error;
		}
    res.render("pages/suspended_customers", {data : result, title:'Active Vendors'});
	
	});

};
exports.activeDeliverer = (req, res, next) => {
	var query1;
	if (req.method == 'GET')
	{
			query1 = "select username,email,phone,fname,lname from customer where flag=4 and active=1;";

	}
    dbConn.query(query1, async (error, result)=>{
		
		if(error)
		{
			console.log (error);
			throw error;
		}
    res.render("pages/active_delivery", {data : result, title:'Active Vendors'});
	
	});

};
exports.suspendedDeliverer = (req, res, next) => {
    var query1;
	if (req.method == 'GET')
	{
			query1 = "select username,email,phone,fname,lname from customer where flag=4 and active=0;";

	}
    dbConn.query(query1, async (error, result)=>{
		
		if(error)
		{
			console.log (error);
			throw error;
		}
    res.render("pages/suspended_delivery", {data : result, title:'Active Vendors'});
	
	});
};
exports.createvendorpage = (req, res, next) => {
    res.render("pages/admin_create");

};
exports.createvendor=async(req,res,next)=>
{
    	 
	const errors = validationResult(req);
	const { body } = req;	
	console.log(body);
	
	// if (!errors.isEmpty()) {
	// 	return res.render('pages/admin_create', {
	// 									error: errors.array()[0].msg, 
	// 									title:'Add Record'
	// 								});
	// }

    try {
		const rname = body.rname;
		const username = body.username;
		const email = body.email; 
		const password =await encrypt.encryptPassword(body.password) ;
		const phone = body.phone;
		const location = body.location;
		const about = body.about;
		 fs.mkdir("./public/vendor_list/"+username,(err)=>
        {
            console.log(err);
        })
         fs.mkdir("./public/vendor_list/"+username+"/images",(err)=>
        {
            console.log(err);
        })
         fs.mkdir("./public/vendor_list/"+username+"/menu",(err)=>
        {
            console.log(err);
        })
       
		var query3 = 'INSERT INTO customer (username ,email,pass,phone,flag,active) VALUES(?,?,?,?,1 , 1)';
		dbConn.query(query3, [username, email, password, phone], 
					(error, rows)=>{
						if(error)
						{
			        //	fs.unlinkSync('public' + imgsrc);

							console.log (error);
							throw error;
						}
						
						if (rows.affectedRows !== 1) {
        			//	fs.unlinkSync('public' + imgsrc);
							return res.render('pages/admin_create', 
												{
													error: 'Error: Record not added.', 
													title:'Add Record'
												});
						}
                        else
                        {
                            let query4="INSERT INTO resturant (rname, location ,about,logo,username) VALUES(?,?,?,'logo',?)";
	                    	dbConn.query(query4, [rname, location, about,username],(errors,rows)=>
                            {
                                if(error)
						{
				    //    fs.unlinkSync('public' + imgsrc);

							console.log (error);
							throw error;
						}
						
						if (rows.affectedRows !== 1) {
			            //	fs.unlinkSync('public' + imgsrc);

							return res.render('pages/admin_create', 
												{
													error: 'Error: Record not added.', 
													title:'Add Record'
												});
						}
                            res.render("pages/admin_create", 
									{
										msg: 'Record successfully added!',
										title:'Add Record'
									});
                            })
                            
                        }

					
				    });
    } 
	catch (e) {
        next(e);
    }
}
exports.updatevendorpage = (req, res, next) => {
	const {body}=req;
	const id=body.edit_id;
	 var query1;

	query1 = "SELECT customer.username,email,phone,Rname,location,about,logo,active from customer inner join resturant on customer.username=resturant.username and customer.username='"+id+"'";

    dbConn.query(query1, async (error, result)=>{
		
		if(error)
		{
			console.log (error);
			throw error;
		}
		//console.log(result.length);
    res.render("pages/edit_a", {data : result[0], title:'Edit Vendors'});
	});
};
exports.updatevendor=(req,res,next)=>
{
	const {body}=req;
	
}
exports.deactivate_vendor = (req, res, next) => {
	const {body}=req;
	const id=body.delete_id;
	const query="UPDATE customer SET active =0 WHERE username='"+id+"'";
	dbConn.query(query, async (error, result)=>{
		
		if(error)
		{
			console.log (error);
			throw error;
		}
		var query1;
		query1 = "SELECT customer.username,email,phone,Rname,location,about,logo,active from customer inner join resturant on customer.username=resturant.username and active=1"

	
    dbConn.query(query1, async (error, result)=>{
		
		if(error)
		{
			console.log (error);
			throw error;
		}
    res.render("pages/admin_index", {data : result, title:'Active Vendors'});
	
	});
		
	
	});
};
exports.activate_vendor = (req, res, next) => {
    const {body}=req;
	const id=body.activate_id;
	const query="UPDATE customer SET active =1 WHERE username='"+id+"'";
	dbConn.query(query, async (error, result)=>{
		
		if(error)
		{
			console.log (error);
			throw error;
		}
		var query1;
		query1 = "SELECT customer.username,email,phone,Rname,location,about,logo,active from customer inner join resturant on customer.username=resturant.username and active=0";
        dbConn.query(query1, async (error, result)=>{
		if(error)
		{
			console.log (error);
			throw error;
		}
    res.render("pages/suspended_vendors", {data : result, title:'Active Vendors'});
	
	});
	
	});
};
exports.deactivate_cust = (req, res, next) => {
	const {body}=req;
	const id=body.delete_id;
	const query="UPDATE customer SET active=0 WHERE username='"+id+"'";
	dbConn.query(query, async (error, result)=>{
		
		if(error)
		{
			console.log (error);
			throw error;
		}
		var query1;	
			query1 = "select username,email,phone,fname,lname from customer where flag=2 and active=1;";
    dbConn.query(query1, async (error, result)=>{
		
		if(error)
		{
			console.log (error);
			throw error;
		}
    res.render("pages/active_customers", {data : result, title:'Active Vendors'});
	
	});
		
	
	});
    
};
exports.activate_cust = (req, res, next) => {
	const {body}=req;
	const id=body.activate_id;
	const query="UPDATE customer SET active =1 WHERE username='"+id+"'";
	dbConn.query(query, async (error, result)=>{
		
		if(error)
		{
			console.log (error);
			throw error;
		}
		var query1;
	
	
			query1 = "select username,email,phone,fname,lname from customer where flag=2 and active=0;";

	
    dbConn.query(query1, async (error, result)=>{
		
		if(error)
		{
			console.log (error);
			throw error;
		}
    res.render("pages/suspended_customers", {data : result, title:'Active Vendors'});
	
	});
	
	});
};
exports.deactivate_del = (req, res, next) => {
    const {body}=req;
	const id=body.delete_id;
	const query="UPDATE customer SET active=0 WHERE username='"+id+"'";
	dbConn.query(query, async (error, result)=>{
		
		if(error)
		{
			console.log (error);
			throw error;
		}
		var query1;
			query1 = "select username,email,phone,fname,lname from customer where flag=4 and active=1;";
    dbConn.query(query1, async (error, result)=>{
		
		if(error)
		{
			console.log (error);
			throw error;
		}
    res.render("pages/active_delivery", {data : result, title:'Active Delivery'});
	
	});
	});
};
exports.activate_del = (req, res, next) => {

    const {body}=req;
	const id=body.activate_id;
	console.log(id);
	const query="UPDATE customer SET active =1 WHERE username='"+id+"'";
	dbConn.query(query, async (error, result)=>{
		
		if(error)
		{
			console.log (error);
			throw error;
		}
		var query1;
	
	
			query1 = "select username,email,phone,fname,lname from customer where flag=2 and active=0;";

	
    dbConn.query(query1, async (error, result)=>{
		
		if(error)
		{
			console.log (error);
			throw error;
		}
    res.render("pages/suspended_customers", {data : result, title:'Active Vendors'});
	
	});
	
	});
};
exports.deposit = (req, res, next) => {
	const {body}=req;
	const id=body.deposit_id;
	var query1;	
	query1 = "select * from customer where username='"+id+"'";
    dbConn.query(query1, async (error, result)=>{
		
		if(error)
		{
			console.log (error);
			throw error;
		}
    res.render("pages/deposit", {data : result[0], title:'Deposit'});
	
	
	});
};
exports.moneydeposit = (req, res, next) => {
	const {body}=req;
	const id=body.deposit_id;
	const init=parseFloat(body.wallet_val);
	const new_val=parseFloat(body.deposit_value);
	let final=init+new_val;
	console.log(final);
	var query3="UPDATE customer SET wallet="+final+" WHERE username='"+id+"'";
	dbConn.query(query3, async (error, result)=>{
		
		if(error)
		{
			console.log (error);
			throw error;
		}
	});
	var query1;	
	query1 = "select * from customer where username='"+id+"'";
    dbConn.query(query1, async (error, result)=>{
		
		if(error)
		{
			console.log (error);
			throw error;
		}
    res.render("pages/deposit", {data : result[0], title:'Deposit'});
	
	
	});
};
exports.createdelivery = (req, res, next) => {
    const errors = validationResult(req);
    const { body } = req;

    if (!errors.isEmpty()) {
        return res.render('pages/delivery_create', {error: errors.array()[0].msg});
    }

    try {
		var query2 = "SELECT * FROM customer WHERE username=?";
        dbConn.query(query2, [body.username], async(error, row)=>{
			if (error)
			{
				console.log(error)
				throw error
			}
			
			if (row.length >= 1) {
				return res.render('pages/delivery_create', {error: 'This username already in use.'});
			}

			//const hashPass = await bcrypt.hash(body._password, 12);
			const hashPass = await encrypt.encryptPassword(body.password);
			var query3 = "INSERT INTO customer(username,fname,lname,email,phone,pass,flag,active,wallet) VALUES(?,?,?,?,?,?,4,1,0)";
			dbConn.query(query3, [body.username,body.fname, body.lname, body.email, body.phone, hashPass], 
						 (error, rows)=>{
							if(error)
							{
								console.log (error);
								throw error;
							}
							
							if (rows.affectedRows !== 1) {
								return res.render('pages/delivery_create', 
													{error: 'Your registration has failed.'});
							}

							res.render("pages/delivery_create",
										{msg: 'You have successfully registered. You can Login now!'});
						 });		
		});
    } catch (e) {
        next(e);
    }
};
exports.profile = (req, res, next) => {
    res.render("pages/edit_admin");
};
exports.adminImport = (req, res, next) => {
    res.render("pages/import_a");
};
exports.vreport= (req, res, next) => {
   let query = "select Rname,customer.username,email,phone,location,active from customer inner join resturant on customer.username=resturant.username";
	dbConn.query(query, function (err, results, fields) {
		if (err) 
			throw err;
     
		const jsonCoursesRecord = JSON.parse(JSON.stringify(results));
		 
		// -> Convert JSON to CSV data
		const csvFields = ['Restaurnt Name', 'username', 'emial', 'phone','location', 
							'status']
								 
		const json2csvParser = new Json2csvParser({ csvFields });
		const csv = json2csvParser.parse(jsonCoursesRecord);
 
		res.setHeader("Content-Type", "text/csv");
		res.setHeader("Content-Disposition", "attachment; filename=Vendor_Report("+today_date+").csv");
		res.status(200).end(csv);
  });
};
exports.creport= (req, res, next) => {
   let query = "SELECT username,fname,lname,email,phone,active FROM customer WHERE flag=2";
	dbConn.query(query, function (err, results, fields) {
		if (err) 
			throw err;
     
		const jsonCoursesRecord = JSON.parse(JSON.stringify(results));
		 
		// -> Convert JSON to CSV data
		const csvFields = [ 'Username','First Name','Last Name', 'Email', 'Phone','status'];
								 
		const json2csvParser = new Json2csvParser({ csvFields });
		const csv = json2csvParser.parse(jsonCoursesRecord);
 
		res.setHeader("Content-Type", "text/csv");
		res.setHeader("Content-Disposition", "attachment; filename=Customer_Report("+today_date+").csv");
		res.status(200).end(csv);
  });
};
exports.dreport= (req, res, next) => {
   let query = "SELECT username,fname,lname,email,phone,active FROM customer WHERE flag=4;";
	dbConn.query(query, function (err, results, fields) {
		if (err) 
			throw err;
     
		const jsonCoursesRecord = JSON.parse(JSON.stringify(results));
		 
		// -> Convert JSON to CSV data
		const csvFields = [ 'Username','First Name','Last Name', 'Email', 'Phone','status'];

								 
		const json2csvParser = new Json2csvParser({ csvFields });
		const csv = json2csvParser.parse(jsonCoursesRecord);
 
		res.setHeader("Content-Type", "text/csv");
		res.setHeader("Content-Disposition", "attachment; filename=Deleverer_Report("+today_date+").csv");
		res.status(200).end(csv);
  });
};
exports.vexport= (req, res, next) => {
   let query = "SELECT * FROM resturant";
	dbConn.query(query, function (err, results, fields) {
		if (err) 
			throw err;
     
		const jsonCoursesRecord = JSON.parse(JSON.stringify(results));
		 
		// -> Convert JSON to CSV data
		const csvFields = ['Restaurnt Name', 'location', 'about', 'logo','username', 
							'state']
								 
		const json2csvParser = new Json2csvParser({ csvFields });
		const csv = json2csvParser.parse(jsonCoursesRecord);
 
		res.setHeader("Content-Type", "text/csv");
		res.setHeader("Content-Disposition", "attachment; filename=Vendor_Table("+today_date+").csv");
		res.status(200).end(csv);
  });
};
exports.cexport= (req, res, next) => {
   let query = "SELECT * FROM customer";
	dbConn.query(query, function (err, results, fields) {
		if (err) 
			throw err;
     
		const jsonCoursesRecord = JSON.parse(JSON.stringify(results));
		 
		// -> Convert JSON to CSV data
		const csvFields = ['username', 'fname',  'lname','emial', 'phone','pass', 'flag', 'active', 
							'wallet']
								 
		const json2csvParser = new Json2csvParser({ csvFields });
		const csv = json2csvParser.parse(jsonCoursesRecord);
 
		res.setHeader("Content-Type", "text/csv");
		res.setHeader("Content-Disposition", "attachment; filename=Customer_Table("+today_date+").csv");
		res.status(200).end(csv);
  });
};
exports.dexport= (req, res, next) => {
   let query = "SELECT * FROM deposits";
	dbConn.query(query, function (err, results, fields) {
		if (err) 
			throw err;
     
		const jsonCoursesRecord = JSON.parse(JSON.stringify(results));
		 
		// -> Convert JSON to CSV data
		const csvFields = ['id', 'sender', 'username', 'amount','total']
								 
		const json2csvParser = new Json2csvParser({ csvFields });
		const csv = json2csvParser.parse(jsonCoursesRecord);
 
		res.setHeader("Content-Type", "text/csv");
		res.setHeader("Content-Disposition", "attachment; filename=Deposit_Table("+today_date+").csv");
		res.status(200).end(csv);
  });
};
exports.oexport= (req, res, next) => {
   let query = "SELECT * FROM orders";
	dbConn.query(query, function (err, results, fields) {
		if (err) 
			throw err;
     
		const jsonCoursesRecord = JSON.parse(JSON.stringify(results));
		 
		// -> Convert JSON to CSV data
		const csvFields = ['id', 'cust_username', 'location', 'food','amount','resturant','state','total', 
							'date','visible','delivery','deliverer','status']
								 
		const json2csvParser = new Json2csvParser({ csvFields });
		const csv = json2csvParser.parse(jsonCoursesRecord);
 
		res.setHeader("Content-Type", "text/csv");
		res.setHeader("Content-Disposition", "attachment; filename=Vendor_Report("+today_date+").csv");
		res.status(200).end(csv);
  });
};
exports.vimport= (req, res, next) => {
	
	const {body}=req;
	console.log(req.filename);
	const CSVFile = uploadCSVFile.single('csvFile')
	CSVFile(req, res, function(err) {
		if (req.file == undefined || err) {
			console.log("Error: No file/wrong file selected! Please select CSV file!")
			req.flash("error", "Error: No file/wrong file selected! Please select CSV file!")
			req.flash ("title", "Import Records")
			return res.redirect("../import");
		}
		filePath = 'public/csvFiles/' + req.file.filename
		csvtojson().fromFile(filePath).then(source => {
			for (var i = 0; i < source.length; i++) {
				var rname = source[i]["Rname"],
					location = source[i]["location"],
					about = source[i]["about"],
					logo = source[i]["logo"]
					username = source[i]["username"]
					state = source[i]["state"]
					
				var records = [
							rname,location,about,logo,username,state
						];
				//Import the record to Mysql database, courses table
				let query3 = "INSERT INTO resturant(Rname,location,about,logo,username,state) VALUES (?, ?, ?, ?, ?, ?)";
															
				dbConn.query(query3, records, (error, results, fields) => {
					if (error)
					{
						console.log(error);
						fs.unlinkSync(filePath)
						error = req.flash("error", "Something wrong! Records are not imported")
						return res.redirect("../pages/import_a");
					}		
				});
			}
			fs.unlinkSync(filePath)
			req.flash("msg", "Records are imported successfully! \r\n Go back to Home page & check it.")
			return res.redirect("../pages/import_a");
		});
	});	
};
exports.cimport= (req, res, next) => {
  
	const CSVFile = uploadCSVFile.single('csvFile')
	CSVFile(req, res, function(err) {
		if (req.file == undefined || err) {
			req.flash("error", "Error: No file/wrong file selected! Please select CSV file!")
			req.flash ("title", "Import Records")
			return res.redirect("./import_a");
		}
		filePath = 'public/csvFiles/' + req.file.filename
		csvtojson().fromFile(filePath).then(source => {
			for (var i = 0; i < source.length; i++) {
				var code = source[i]["code"],
					title = source[i]["title"],
					description = source[i]["description"],
					category = source[i]["category"]
					certificate = source[i]["certificate"]
					duration = source[i]["duration"]
					cost = source[i]["cost"]
					imagePath = source[i]["imagePath"]
					
				var records = [
							code, title, 
							description, category, 
							certificate, duration, 
							cost, imagePath, userId
						];
				//Import the record to Mysql database, courses table
				let query3 = `INSERT INTO courses (code, title, description, category,` +
											`certificate, duration, cost, imagePath, user_id) ` +
											`VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
															
				dbConn.query(query3, records, (error, results, fields) => {
					if (error)
					{
						console.log(error);
						fs.unlinkSync(filePath)
						error = req.flash("error", "Something wrong! Records are not imported")
						return res.redirect("../pages/importCSV");
					}		
				});
			}
			fs.unlinkSync(filePath)
			req.flash("msg", "Records are imported successfully! \r\n Go back to Home page & check it.")
			return res.redirect("../pages/importCSV");
		});
	});	
};
exports.oimport= (req, res, next) => {
  
	const CSVFile = uploadCSVFile.single('csvFile')
	CSVFile(req, res, function(err) {
		if (req.file == undefined || err) {
			req.flash("error", "Error: No file/wrong file selected! Please select CSV file!")
			req.flash ("title", "Import Records")
			return res.redirect("./import_a");
		}
		filePath = 'public/csvFiles/' + req.file.filename
		csvtojson().fromFile(filePath).then(source => {
			for (var i = 0; i < source.length; i++) {
				var code = source[i]["code"],
					title = source[i]["title"],
					description = source[i]["description"],
					category = source[i]["category"]
					certificate = source[i]["certificate"]
					duration = source[i]["duration"]
					cost = source[i]["cost"]
					imagePath = source[i]["imagePath"]
					
				var records = [
							code, title, 
							description, category, 
							certificate, duration, 
							cost, imagePath, userId
						];
				//Import the record to Mysql database, courses table
				let query3 = `INSERT INTO courses (code, title, description, category,` +
											`certificate, duration, cost, imagePath, user_id) ` +
											`VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
															
				dbConn.query(query3, records, (error, results, fields) => {
					if (error)
					{
						console.log(error);
						fs.unlinkSync(filePath)
						error = req.flash("error", "Something wrong! Records are not imported")
						return res.redirect("../pages/importCSV");
					}		
				});
			}
			fs.unlinkSync(filePath)
			req.flash("msg", "Records are imported successfully! \r\n Go back to Home page & check it.")
			return res.redirect("../pages/importCSV");
		});
	});	
};
exports.sactiveVendors = (req, res, next) => {
	const {body}=req;
	const search=body.search_value;
	console.log(search);
    var query1;
	
		if(typeof(search)!="undefined")
			query1 = "SELECT customer.username,email,phone,Rname,location,about,logo,active from customer inner join resturant on customer.username=resturant.username and active=1 and Rname like'%"+search+"%'";
		else
			query1 = "SELECT customer.username,email,phone,Rname,location,about,logo,active from customer inner join resturant on customer.username=resturant.username and active=1";

    dbConn.query(query1, async (error, result)=>{
		
		if(error)
		{
			console.log (error);
			throw error;
		}
    res.render("pages/admin_index", {data : result, title:'Active Vendors'});
	
	});
};
exports.vreportpdf= (req, res, next) => {
   let query = "select Rname,customer.username,email,phone,location,active from customer inner join resturant on customer.username=resturant.username";
	dbConn.query(query, function (err, results, fields) {
		if (err) 
			throw err;
		let table="";
		table += "<table border='1' style='width:100%;word-break:break-word;'>";
		table += "<tr>";
		table += "<th >Resturant Name</th>";
		table += "<th >Email</th>";
		table += "<th >Username</th>";
		table += "<th >Phone/th>";

		table += "</tr>";

forEach(results => {
	table += "<tr>";
    table += "<td>"+results.Rname+"</td>";
    table += "<td>"+results.email+"</td>";
    table += "<td>"+results.username+"</td>";
    table += "<td>"+results.phone+"</td>";

    table += "</tr>";
});
table += "</table>";
var options = {
  "format": "A4",
  "orientation": "landscape",
  "border": {
    "top": "0.1in",
},
"timeout": "120000"
};		
pdf.create(table, options).toFile('./test.pdf', function(err, result) {
  if (err) return console.log(err);
  console.log("pdf create");
});		 
		
  });
};