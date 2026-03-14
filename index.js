import express from "express";
import pool from "./db.js";
import session from "express-session";
import bcrypt from "bcrypt";
import multer from "multer";
import helmet from "helmet";
import dotenv from "dotenv";


dotenv.config();




const app = express();

const saltRounds = 10;

// app.use(helmet());


app.use(helmet({
    contentSecurityPolicy: false
}));

// middleware
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("public/uploads"));



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });



// For session out
app.use(
  session({
    secret: process.env.SESSION_SECRET ||  "fallback-secret",
    resave: false,
    saveUninitialized: false,
  })
);



app.use(async (req, res, next) => {
  if (!req.session.user) {
    res.locals.unreadCount = 0;
    return next();
  }

  try {
    const result = await pool.query(
      "SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false",
      [req.session.user.id]
    );

    res.locals.unreadCount = parseInt(result.rows[0].count);
    next();
  } catch (err) {
    console.error("Unread count error:", err);
    res.locals.unreadCount = 0;
    next();
  }
});


// HOME
app.get("/", async (req, res) => {

  //   const page = req.query.page || 1;
  // const limit = 10;
  // const offset = (page - 1) * limit;


  try {
    const result = await pool.query(`
      SELECT 
        items.id AS item_id,
        items.type,
        items.item_name,
        items.category,
        items.description,
        items.location,
        items.landmark,
        items.created_at,
        users.first_name,
        users.last_name,
        items.image,
        items.status
      FROM items
      JOIN users ON items.user_id = users.id
      ORDER BY items.created_at DESC
    `);

    res.render("index", {
      title: "Kashmir Lost & Found Portal",
      items: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.render("index", {
      title: "Kashmir Lost & Found Portal",
      items: [],
    });
  }
});



// app.get("/items", async (req, res) => {
//   // ❌ NOT logged in
//   if (!req.session.user) {
//      return res.redirect("/login");
   

//   }


//   // code to show
// });





// REGISTER PAGE
app.get("/register", (req, res) => {
  res.render("register");
});

// REGISTER LOGIC
// app.post("/register", async (req, res) => {

//   const { first_name, last_name, phone, email, password } = req.body;

//     if(password.length < 6){
//    return res.send("Password must be at least 6 characters");
// }

//   try {
//     const hashedPassword = await bcrypt.hash(password,saltRounds);
//     await pool.query(
//       `INSERT INTO users 
//        (first_name, last_name, phone, email, password) 
//        VALUES ($1, $2, $3, $4, $5)`,
//       [first_name, last_name, phone, email, hashedPassword]
//     );

//     res.redirect("/login");
//   } catch (err) {
//     console.error("Register error:", err.message);
//     res.status(500).send("Error registering user");
//   }
// });



app.post("/register", async (req, res) => {

  const { first_name, last_name, phone, email, password } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.send("Please fill all required fields");
  }

  if (password.length < 6) {
    return res.send("Password must be at least 6 characters");
  }

  try {

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.send("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await pool.query(
      `INSERT INTO users 
       (first_name, last_name, phone, email, password) 
       VALUES ($1, $2, $3, $4, $5)`,
      [first_name, last_name, phone, email, hashedPassword]
    );

    res.redirect("/login");

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


// app.post("/items/:id/close", async (req,res)=>{
//   await pool.query(
//     "UPDATE items SET status='closed' WHERE id=$1 AND user_id=$2",
//     [req.params.id, req.session.user.id]
//   );
//   // res.redirect('login_dashboard');
// });


app.post("/items/:id/close", async (req, res) => {

  if (!req.session.user) {
    return res.redirect("/login");
  }

  try {

    await pool.query(
      "UPDATE items SET status = 'closed' WHERE id = $1 AND user_id = $2",
      [req.params.id, req.session.user.id]
    );

    res.redirect("/my-posts");

  } catch (err) {

    console.error(err);
    res.status(500).send("Server error");

  }

});


// LOGIN PAGE
app.get("/login", (req, res) => {
  res.render("login");
});


// FILL LOGIN DETAILS 
// app.post("/login", async(req, res) => {
//   const {email,password} = req.body;

//   const result = await pool.query("SELECT * FROM users WHERE email = $1" , [email]);

//   // if (result.rows.length ===0){
//   //   return res.send("invalid Login");
//   // }

//   return res.status(401).render("login", {
//   error: "Invalid email or password"
// });


  
//     const user = result.rows[0];

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.send("Invalid login");
//     }

//   req.session.user = {
//     id: result.rows[0].id,
//     first_name: result.rows[0].first_name,
//     last_name: result.rows[0].last_name,
//   };

//   res.redirect("/login_dashboard");
// });

app.post("/login", async (req, res) => {

  const { email, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  // Check if user exists
  if (result.rows.length === 0) {
    return res.status(401).render("login", {
      error: "Invalid email or password"
    });
  }

  const user = result.rows[0];

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).render("login", {
      error: "Invalid email or password"
    });
  }

  // Save user in session
  req.session.user = {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
  };

  res.redirect("/login_dashboard");
});


// LOGIN DASHBOARD
app.get("/login_dashboard", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  try {
    const result = await pool.query(`
      SELECT 
        items.id AS item_id,
        items.type,
        items.item_name,
        items.category,
        items.description,
        items.location,
        items.landmark,
        items.created_at,
        users.first_name,
        users.last_name,
        items.image,
        items.status
      FROM items
      JOIN users ON items.user_id = users.id
      ORDER BY items.created_at DESC
    `);

    res.render("login_dashboard", {
      user: req.session.user,
      items: result.rows   // ⭐ THIS WAS MISSING
    });

  } catch (err) {
    console.error(err);
    res.render("login_dashboard", {
      user: req.session.user,
      items: []
    });
  }
});

// app.get("/search", async(req,res)=>{

//   const query = req.query.q;

//   try{
//     const result = await pool.query(`SELECT * FROM items WHERE item_name ILIKE $1
//       OR description ILIKE $1 OR location ILIKE $1`,[`%${query}%`]);

//       res.render('login_dashboard',{items:result.rows, query});
//   }
//    catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }

// });


app.get("/search", async (req, res) => {

  const query = req.query.q;

  if (!query) {
    return res.redirect("/login_dashboard");
  }

  try {

    const result = await pool.query(
      `SELECT 
        items.id AS item_id,
        items.type,
        items.item_name,
        items.category,
        items.description,
        items.location,
        items.landmark,
        items.created_at,
        users.first_name,
        users.last_name,
        items.image,
        items.status
      FROM items
      JOIN users ON items.user_id = users.id
      WHERE 
        items.item_name ILIKE $1
        OR items.description ILIKE $1
        OR items.location ILIKE $1
        OR items.landmark ILIKE $1
      ORDER BY items.created_at DESC`,
      [`%${query}%`]
    );

    res.render("login_dashboard", {
      items: result.rows,
      user: req.session.user,
      search: query
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }

});


// go to found or lost page
app.get("/items/new", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  res.render("post_item",{
    user : req.session.user
  });
});


// it only collects the data 
app.post("/items", upload.single("image"), async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const { type, item_name, category, description, location, landmark } = req.body;
  const userId = req.session.user.id;

//   const imagePath = "/uploads/" + req.file.filename;

   const imagePath = req.file ? "/uploads/" + req.file.filename : null;

  try {
    await pool.query(
      `INSERT INTO items 
       (user_id, type, item_name, category, description, location,image, landmark) 
       VALUES ($1, $2, $3, $4, $5, $6,$7, $8)`,
      [userId, type, item_name, category, description, location,imagePath, landmark]


      
    );

    console.log("Body:", req.body);

     res.redirect("/login_dashboard");
  } catch (err) {
    console.error("Item insert error:", err.message);
    res.status(500).send("Error posting item");
  }

    console.log("Body:", req.body);
});



app.get("/items/:id", async (req, res) => {

  if (!req.session.user) return res.redirect("/login");

  const itemId = req.params.id;
  const currentUser = req.session.user || null;

  try {
    const result = await pool.query(
      `
      SELECT 
        items.*,
        users.id   AS owner_id,
        users.first_name,
        users.last_name,
        users.email,
        users.phone
      FROM items
      JOIN users ON items.user_id = users.id
      WHERE items.id = $1
      `,
      [itemId]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Item not found");
    }

    const row = result.rows[0];

    const item = {
      id: row.id,
      item_name: row.item_name,
      description: row.description,
      location: row.location,
      landmark: row.landmark,
      type: row.type,
      status: row.status,
      created_at: row.created_at,
      user_id: row.user_id,
      user: {
        id: row.owner_id,
        first_name: row.first_name,
        last_name: row.last_name,
        email: row.email,
        phone: row.phone
      }
    };

    const isOwner = currentUser && currentUser.id === row.owner_id;

    res.render("items_view", {
      item,
      user: currentUser,
      isOwner
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


// app.get("/my-posts", async (req, res) => {
//   if (!req.session.user) {
//     return res.redirect("/login");
//   }

//   try {
//     const result = await pool.query(
//       "SELECT * FROM items WHERE user_id = $1 ORDER BY created_at DESC",
//       [req.session.user.id]
//     );

//     res.render("my_posts", {
//       title: "My Posts",
//       items: result.rows,
//       user: req.session.user   // ✅ PASS USER
//     });
//   } catch (err) {
//     console.error(err);
//     res.render("my_posts", {
//       title: "My Posts",
//       items: [],
//       user: req.session.user
//     });
//   }
// });


app.post("/items/:id/delete", async (req, res) => {

  if (!req.session.user) return res.redirect("/login");

  const itemId = req.params.id;
  const userId = req.session.user.id;

  try {

    await pool.query(
      "DELETE FROM items WHERE id = $1 AND user_id = $2",
      [itemId, userId]
    );

    res.redirect("/my-posts");

  } catch (err) {

    console.error(err);
    res.status(500).send("Server error");

  }

});


  app.get("/my-posts", async (req, res) => {

  if (!req.session.user) return res.redirect("/login");

  try {

    const result = await pool.query(
      "SELECT * FROM items WHERE user_id = $1 ORDER BY created_at DESC",
      [req.session.user.id]
    );

    res.render("my_posts", {
      items: result.rows,
      user: req.session.user
    });

  } catch (err) {

    console.error(err);
    res.status(500).send("Server error");

  }

});


app.get("/contact-requests", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  const ownerId = req.session.user.id;

  try {
    const result = await pool.query(
      `
      SELECT 
        cr.id,
        cr.status,
        cr.message,
        cr.created_at,
        cr.item_id,

        i.item_name,
        i.type AS item_type,

        u.first_name,
        u.last_name,
        u.email,
        u.phone

      FROM contact_requests cr
      JOIN items i ON cr.item_id = i.id
      JOIN users u ON cr.requester_id = u.id
      WHERE cr.owner_id = $1
      ORDER BY cr.created_at DESC
      `,
      [ownerId]
    );


    res.render("contact_requests", {
      requests: result.rows,
      user: req.session.user

    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});




// app.get("/notifications", async (req, res) => {
//   if (!req.session.user) return res.redirect("/login");

//   const result = await pool.query(
//     `
//     SELECT *
//     FROM notifications
//     WHERE user_id = $1
//     ORDER BY created_at DESC
//     `,
//     [req.session.user.id]
//   );

//   // Mark as read
//   await pool.query(
//     "UPDATE notifications SET is_read = true WHERE user_id = $1",
//     [req.session.user.id]
//   );

//   res.render("notifications", {
//     notifications: result.rows,
//     user: req.session.user
//   });
// });


// FIX — wrap both queries
app.get("/notifications", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  try {
    const result = await pool.query(
      `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.session.user.id]
    );

    await pool.query(
      "UPDATE notifications SET is_read = true WHERE user_id = $1",
      [req.session.user.id]
    );

    res.render("notifications", {
      notifications: result.rows,
      user: req.session.user
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});




app.get("/my-requests", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  try {
    const result = await pool.query(
      `
      SELECT 
        cr.id,
        cr.status,
        cr.message,
        cr.created_at,
        i.id AS item_id,
        i.item_name,
        i.type AS item_type,
        u.first_name AS owner_first,
        u.last_name AS owner_last,
        u.email,
        u.phone
      FROM contact_requests cr
      JOIN items i ON cr.item_id = i.id
      JOIN users u ON cr.owner_id = u.id
      WHERE cr.requester_id = $1
      ORDER BY cr.created_at DESC
      `,
      [req.session.user.id]
    );

    res.render("my_requests", {
      requests: result.rows,
      user: req.session.user
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});



app.post("/contact-requests/:id/approve", async (req, res) => {
  if (!req.session.user) return res.sendStatus(401);

  const requestId = req.params.id;

  try {
    // 1️⃣ Update status + get requester & item
    const result = await pool.query(
      `
      UPDATE contact_requests
      SET status = 'approved'
      WHERE id = $1 AND owner_id = $2
      RETURNING requester_id, item_id
      `,
      [requestId, req.session.user.id]
    );

    if (result.rowCount === 0) return res.sendStatus(403);

    const { requester_id, item_id } = result.rows[0];

    // 2️⃣ 🔔 CREATE NOTIFICATION
    await pool.query(
      `
      INSERT INTO notifications (user_id, type, title, message, item_id)
      VALUES ($1, 'approved', 'Request Approved',
              'Your request has been approved. You can now contact the owner.',
              $2)
      `,
      [requester_id, item_id]
    );

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});



app.post("/items/:id/contact", async (req, res) => {
  if (!req.session.user) return res.sendStatus(401);

  const itemId = req.params.id;
  const requesterId = req.session.user.id;
  const { message } = req.body;

  try {
    // Get owner
    const itemRes = await pool.query(
      "SELECT user_id FROM items WHERE id = $1",
      [itemId]
    );

    if (itemRes.rows.length === 0) return res.sendStatus(404);

    const ownerId = itemRes.rows[0].user_id;

    if (ownerId === requesterId) return res.sendStatus(400);

    // Prevent duplicate request
    const check = await pool.query(
      "SELECT * FROM contact_requests WHERE item_id = $1 AND requester_id = $2",
      [itemId, requesterId]
    );

    if (check.rows.length > 0) {
      return res.status(400).send("Already requested");
    }

    await pool.query(
      `
      INSERT INTO contact_requests (item_id, requester_id, owner_id, message)
      VALUES ($1, $2, $3, $4)
      `,
      [itemId, requesterId, ownerId, message]
    );

    res.sendStatus(200);

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});


app.post("/contact-requests/:id/reject", async (req, res) => {
  if (!req.session.user) return res.sendStatus(401);

  const requestId = req.params.id;

  try {
    const result = await pool.query(
      `
      UPDATE contact_requests
      SET status = 'rejected'
      WHERE id = $1 AND owner_id = $2
      RETURNING requester_id, item_id
      `,
      [requestId, req.session.user.id]
    );

    if (result.rowCount === 0) return res.sendStatus(403);

    const { requester_id, item_id } = result.rows[0];

    // 🔔 CREATE NOTIFICATION
    await pool.query(
      `
      INSERT INTO notifications (user_id, type, title, message, item_id)
      VALUES ($1, 'rejected', 'Request Rejected',
              'Your request was rejected by the owner.',
              $2)
      `,
      [requester_id, item_id]
    );

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});


app.post("/items/:id/edit", async (req, res) => {

  if (!req.session.user) return res.redirect("/login");

  try {
    const { item_name, category, location, description, landmark } = req.body;

    await pool.query(
      `UPDATE items 
       SET item_name=$1, category=$2, location=$3, description=$4 , landmark = $5
       WHERE id=$6 AND user_id=$7`,
      [item_name, category, location, description, landmark, req.params.id, req.session.user.id]
    );

    res.redirect("/my-posts");

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});




app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});













// ════════════════════════════════════════════
//  ADMIN ROUTES  —  add these to your app.js
// ════════════════════════════════════════════

// ── Admin auth guard middleware ──
function adminOnly(req, res, next) {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.redirect("/admin/login");
  }
  next();
}

// ── Admin Login page ──
app.get("/admin/login", (req, res) => {
  res.render("admin_login", { error: null });
});

app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;
  // Simple hardcoded admin — swap with DB check if you want
  if (username === process.env.ADMIN_USER &&
  password === process.env.ADMIN_PASSWORD) {
    req.session.user = { isAdmin: true, first_name: "Admin" };
    return res.redirect("/admin");
  }
  res.render("admin_login", { error: "Invalid credentials" });
});

// ── Admin Dashboard ──
app.get("/admin", adminOnly, async (req, res) => {
  try {
    const [usersRes, itemsRes, requestsRes, notifsRes] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM users"),
      pool.query("SELECT COUNT(*) FROM items"),
      pool.query("SELECT COUNT(*) FROM contact_requests"),
      pool.query("SELECT COUNT(*) FROM notifications WHERE is_read = false"),
    ]);

    const [lostRes, foundRes, closedRes, openRes] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM items WHERE type = 'Lost'"),
      pool.query("SELECT COUNT(*) FROM items WHERE type = 'Found'"),
      pool.query("SELECT COUNT(*) FROM items WHERE status = 'closed'"),
      pool.query("SELECT COUNT(*) FROM items WHERE status != 'closed' OR status IS NULL"),
    ]);

    // Recent 5 items
    const recentItems = await pool.query(`
      SELECT items.*, users.first_name, users.last_name
      FROM items JOIN users ON items.user_id = users.id
      ORDER BY items.created_at DESC LIMIT 5
    `);

    // Recent 5 users
    const recentUsers = await pool.query(`
      SELECT * FROM users ORDER BY id DESC LIMIT 5
    `);

    res.render("admin_dashboard", {
      stats: {
        users:    parseInt(usersRes.rows[0].count),
        items:    parseInt(itemsRes.rows[0].count),
        requests: parseInt(requestsRes.rows[0].count),
        unread:   parseInt(notifsRes.rows[0].count),
        lost:     parseInt(lostRes.rows[0].count),
        found:    parseInt(foundRes.rows[0].count),
        closed:   parseInt(closedRes.rows[0].count),
        open:     parseInt(openRes.rows[0].count),
      },
      recentItems: recentItems.rows,
      recentUsers: recentUsers.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ── Admin — All Items ──
app.get("/admin/items", adminOnly, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT items.*, users.first_name, users.last_name, users.email
      FROM items JOIN users ON items.user_id = users.id
      ORDER BY items.created_at DESC
    `);
    res.render("admin_items", { items: result.rows });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// ── Admin — Delete Item ──
app.post("/admin/items/:id/delete", adminOnly, async (req, res) => {
  await pool.query("DELETE FROM items WHERE id = $1", [req.params.id]);
  res.redirect("/admin/items");
});

// ── Admin — All Users ──
app.get("/admin/users", adminOnly, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT users.*, COUNT(items.id) AS item_count
      FROM users
      LEFT JOIN items ON items.user_id = users.id
      GROUP BY users.id
      ORDER BY users.id DESC
    `);
    res.render("admin_users", { users: result.rows });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// ── Admin — Delete User ──
app.post("/admin/users/:id/delete", adminOnly, async (req, res) => {
  await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
  res.redirect("/admin/users");
});

// ── Admin Logout ──
app.get("/admin/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/admin/login"));
});









// SERVER
// app.listen(3000, () => {
//   console.log("Server running on port 3000");
// });


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
