import pool from "../db/db.js";

export async function findUserByEmailAndRole(email, role) {
  let table;
  switch (role) {
    case "student":
      table = "students";
      break;
    case "alumni":
      table = "alumni";
      break;
    case "faculty":
      table = "faculty";
      break;
    default:
      throw new Error("Invalid role");
  }

  const result = await pool.query(`SELECT * FROM ${table} WHERE email = $1`, [
    email,
  ]);
  return result.rows[0];
}

export async function checkIfEmailExists(email) {
  const result = await pool.query(
    `SELECT email FROM students WHERE email = $1
     UNION
     SELECT email FROM alumni WHERE email = $1
     UNION
     SELECT email FROM faculty WHERE email = $1`,
    [email]
  );
  return result.rows.length > 0;
}
