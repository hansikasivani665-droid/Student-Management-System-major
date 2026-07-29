const express = require("express");
const router = express.Router();

const db = require("../models/database");


// ================================
// GET ADMIN PROFILE
// ================================

router.get("/profile",(req,res)=>{


    db.get(

        `
        SELECT *
        FROM admin
        LIMIT 1
        `,

        [],

        (err,row)=>{


            if(err){

                return res.status(500).json({

                    success:false,
                    message:err.message

                });

            }


            res.json({

                success:true,
                admin:row || {}

            });


        }

    );


});





// ================================
// UPDATE ADMIN PROFILE
// ================================


router.post("/profile",(req,res)=>{


const {

name,
email,
phone,
department,
qualification,
experience,
password

}=req.body;



db.run(

`

INSERT INTO admin

(
name,
email,
phone,
department,
qualification,
experience,
password
)

VALUES(?,?,?,?,?,?,?)

`,

[

name,
email,
phone,
department,
qualification,
experience,
password

],


(err)=>{


if(err){

return res.status(500).json({

success:false,
message:err.message

});

}


res.json({

success:true,

message:"Admin Profile Saved"

});


}


);



});







// ================================
// SETTINGS
// ================================


router.get("/settings",(req,res)=>{


db.get(

`
SELECT *
FROM settings
LIMIT 1
`,

[],

(err,row)=>{


if(err){

return res.status(500).json({

success:false,
message:err.message

});

}


res.json({

success:true,
settings:row || {}

});


}

);


});






router.post("/settings",(req,res)=>{


const {

collegeName,
systemName,
academicYear,
theme,
notifications

}=req.body;



db.run(

`

INSERT INTO settings

(
collegeName,
systemName,
academicYear,
theme,
notifications
)

VALUES(?,?,?,?,?)

`,

[

collegeName,
systemName,
academicYear,
theme,
notifications

],


(err)=>{


if(err){

return res.status(500).json({

success:false,
message:err.message

});

}



res.json({

success:true,

message:"Settings Saved"

});


}



);



});




module.exports = router;