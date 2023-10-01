const mariadb = require('mariadb');
const express = require('express');
const app = express();
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const PORT = 3000;

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'sample',
  connectionLimit: 5,
});

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Assignment 08 API',
      description: 'Detais of all APIs',
      version: '1.0.0',
    },
  },
  apis: ['./server.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  const appDetailsHTML = `
    <html>
      <head>
        <title>Welcome to Assignment 07</title>
      </head>
      <body>
        <h1>Application Details</h1>
        <ul>
        GET REQUEST DETAILS
        <br/>
         <li>SWAGGER DOC: <a href="/docs">/docs</a></li>
          <li>Gets details of all students: <a href="/students">/students</a></li>
          <li>Gets details of a students with student id: <a href="/students/15">/students/:studentid</a></li>

          <li>Gets details of all customers: <a href="/customers">/customers</a></li>
          <li>Gets details of a customer with customer id: <a href="/customers/C00013">/customers/:customerid</a></li>

          <li>Gets details of company:  <a href="/company">/company</a></li>
          <li>Gets details of orders:  <a href="/daysorder">/daysorder</a></li>
          <li>Gets details of studentreport:  <a href="/studentreport">/studentreport</a></li>
        </ul>
      </body>
    </html>
  `;

  res.send(appDetailsHTML);
});

/**
 * @swagger
 * /agents:
 *   get:
 *     summary: Get a list of agents
 *     description: Retrieve a list of all agents from the database.
 *     responses:
 *       200:
 *         description: Successful operation. Returns a list of agents.
 *       500:
 *         description: Internal Server Error.
 */
app.get('/agents', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM agents');
    conn.release();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Get a list of customers
 *     description: Retrieve a list of all customers from the database.
 *     responses:
 *       200:
 *         description: Successful operation. Returns a list of customers.
 *       500:
 *         description: Internal Server Error.
 */
app.get('/customers', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM customer');
    conn.release();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /customers/{customerid}:
 *   get:
 *     summary: Get customer by ID
 *     description: Retrieve customer details by specifying the customer's ID.
 *     parameters:
 *       - in: path
 *         name: customerid
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the customer to retrieve.
 *     responses:
 *       200:
 *         description: Successful operation. Returns customer details.
 *       404:
 *         description: Customer not found.
 *       500:
 *         description: Internal Server Error.
 */
app.get('/customers/:customerid', async (req, res) => {
  const customerid = req.params.customerid;
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM customer WHERE CUST_CODE = ?', [customerid]);
    conn.release();
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /company:
 *   get:
 *     summary: Get company details
 *     description: Retrieve details of the company.
 *     responses:
 *       200:
 *         description: Successful operation. Returns company details.
 *       500:
 *         description: Internal Server Error.
 */
app.get('/company', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM company');
    conn.release();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /daysorder:
 *   get:
 *     summary: Get days order details
 *     description: Retrieve details of days orders.
 *     responses:
 *       200:
 *         description: Successful operation. Returns days order details.
 *       500:
 *         description: Internal Server Error.
 */
app.get('/daysorder', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM daysorder');
    conn.release();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Get list of students
 *     description: Retrieve a list of all students.
 *     responses:
 *       200:
 *         description: Successful operation. Returns a list of students.
 *       500:
 *         description: Internal Server Error.
 */
app.get('/students', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM student');
    conn.release();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
/**
 * @swagger
 * /students/{studentid}:
 *   get:
 *     summary: Get student by ID
 *     description: Retrieve student details by specifying the student's ID.
 *     parameters:
 *       - in: path
 *         name: studentid
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student to retrieve.
 *     responses:
 *       200:
 *         description: Successful operation. Returns student details.
 *       404:
 *         description: Student not found.
 *       500:
 *         description: Internal Server Error.
 */
app.get('/students/:studentid', async (req, res) => {
  const studentid = req.params.studentid;
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM student WHERE ROLLID = ?', [studentid]);
    conn.release();
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Add a new student
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: student
 *         description: The student object to be added
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             NAME:
 *               type: string
 *             TITLE:
 *               type: string
 *             CLASS:
 *               type: string
 *             SECTION:
 *               type: string
 *             ROLLID:
 *               type: string
 *         example:
 *           NAME: John Doe
 *           TITLE: Senior
 *           CLASS: 12
 *           SECTION: A
 *           ROLLID: 12345
 *     responses:
 *       201:
 *         description: Student added successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *           example:
 *             message: Student added successfully
 *       400:
 *         description: Bad request, missing or invalid parameters
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *           example:
 *             error: All fields (NAME, TITLE, CLASS, SECTION, ROLLID) are required
 *       500:
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *           example:
 *             error: Internal Server Error
 */
app.post('/students', express.json(), async (req, res) => {
  console.log(req.body);
  const { NAME, TITLE, CLASS, SECTION, ROLLID } = req.body;
  
  if (!NAME || !TITLE || !CLASS || !SECTION || !ROLLID) {
    return res.status(400).json({ error: 'All fields (NAME, TITLE, CLASS, SECTION, ROLLID) are required' });
  }
  try {
    const conn = await pool.getConnection();
    await conn.query('INSERT INTO student (NAME, TITLE, CLASS, SECTION, ROLLID) VALUES (?, ?, ?, ?, ?)', [
      NAME,
      TITLE,
      CLASS,
      SECTION,
      ROLLID,
    ]);
    conn.release();

    res.status(201).json({ message: 'Student added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 *  /students/{rollid}:
 *     put:
 *       summary: Update student information by Roll ID
 *       consumes:
 *         - application/json
 *       parameters:
 *         - in: path
 *           name: rollid
 *           description: The Roll ID of the student to be updated
 *           required: true
 *           type: string
 *         - in: body
 *           name: student
 *           description: The updated student object
 *           required: true
 *           schema:
 *             type: object
 *             properties:
 *               NAME:
 *                 type: string
 *               TITLE:
 *                 type: string
 *               CLASS:
 *                 type: string
 *               SECTION:
 *                 type: string
 *           example:
 *             NAME: John Doe
 *             TITLE: Senior
 *             CLASS: 12
 *             SECTION: B
 *       responses:
 *         200:
 *           description: Student updated successfully
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *             example:
 *               message: Student updated successfully
 *         400:
 *           description: Bad request, missing or invalid parameters
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *             example:
 *               error: All fields (NAME, TITLE, CLASS, SECTION) are required
 *         500:
 *           description: Internal server error
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
              example:
                error: Internal Server Error
 */
app.put('/students/:rollid', express.json(), async (req, res) => {
  const studentid = req.params.rollid;
  const { NAME, TITLE, CLASS, SECTION } = req.body;

  if (!NAME || !TITLE || !CLASS || !SECTION) {
    return res.status(400).json({ error: 'All fields (NAME, TITLE, CLASS, SECTION) are required' });
  }

  try {
    const conn = await pool.getConnection();
    await conn.query(
      'UPDATE student SET NAME = ?, TITLE = ?, CLASS = ?, SECTION = ? WHERE ROLLID = ?',
      [NAME, TITLE, CLASS, SECTION, studentid]
    );
    conn.release();

    res.json({ message: 'Student updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /students/{rollid}:
 *   delete:
 *     summary: Delete a student by ID
 *     description: Delete a student by specifying the student's ID.
 *     parameters:
 *       - in: path
 *         name: rollid
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student to delete.
 *     responses:
 *       200:
 *         description: Student deleted successfully.
 *       404:
 *         description: Student not found.
 *       500:
 *         description: Internal Server Error.
 */
app.delete('/students/:rollid', async (req, res) => {
  const studentid = req.params.rollid;

  try {
    const conn = await pool.getConnection();
    const result = await conn.query('DELETE FROM student WHERE ROLLID = ?', [studentid]);
    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /studentreport:
 *   get:
 *     summary: Get student reports
 *     description: Retrieve student reports from the database.
 *     responses:
 *       200:
 *         description: Successful operation. Returns student reports.
 *       500:
 *         description: Internal Server Error.
 */
app.get('/studentreport', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM studentreport');
    conn.release();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /students/{rollid}:
 *   patch:
 *     summary: Update a student by ID
 *     description: Update a student's details by specifying the student's ID.
 *     parameters:
 *       - in: path
 *         name: rollid
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the student to update.
 *       - in: body
 *         name: student
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             NAME:
 *               type: string
 *             TITLE:
 *               type: string
 *             CLASS:
 *               type: string
 *             SECTION:
 *               type: string
 *         description: The updated student information.
 *     responses:
 *       200:
 *         description: Successful operation. Returns a success message.
 *       400:
 *         description: Bad request. Invalid input parameters.
 *       404:
 *         description: Student not found.
 *       500:
 *         description: Internal Server Error.
 */
app.patch('/students/:rollid', express.json(), async (req, res) => {
  const studentid = req.params.rollid;
  const updatedFields = req.body;
  if (Object.keys(updatedFields).length === 0) {
    return res.status(400).json({ error: 'At least one field (NAME, TITLE, CLASS, SECTION) is required for update' });
  }
  try {
    const conn = await pool.getConnection();
    const columnsToUpdate = Object.keys(updatedFields).map(field => `${field} = ?`).join(', ');
    const valuesToUpdate = Object.values(updatedFields);
    valuesToUpdate.push(studentid);
    await conn.query(`UPDATE student SET ${columnsToUpdate} WHERE ROLLID = ?`, valuesToUpdate);
    conn.release();
    res.json({ message: 'Student updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
