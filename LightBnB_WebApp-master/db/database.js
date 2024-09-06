const { query } = require("express");
const users = require("./json/users.json");
const { Pool } = require("pg");

const pool = new Pool({
  user: "labber",
  password: "labber",
  host: "localhost",
  database: "lightbnb",
  port: 5432
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  return pool
    .query(
      `SELECT *
     FROM users
     WHERE email = $1;
     `,
      [email]
    )
    .then((result) => {
      if (!result.rows) {
        return null;
      }
      return result.rows[0]
    })
    .catch((err) => {
      console.log(err.message)
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool
    .query(
      `SELECT *
     FROM users
     WHERE users.id = $1;
     `,
      [id]
    )
    .then((result) => {
      if (!result.rows[0].id) {
        return null;
      }
      console.log(result.rows[0].id)
      return result.rows[0].id
    })
    .catch((err) => {
      console.log(err.message)
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  return pool
    .query(
      `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING *;
     `,
      [user.name, user.email, user.password]
    )
    .then((result) => {
      if (!result.rows) {
        return null;
      }
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message)
    });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return pool
    .query(`
  SELECT reservations.*, properties.*, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;
  `, [guest_id, limit])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    })
};

/// Properties

/**
 * Get all properties.
 * @param {{pool}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {

  const queryParams = [];
  let filterQueries = []; //checks when a query needs a where keyword and  also joins the queries together

  let queryString = `
    SELECT properties.*, AVG(property_reviews.rating) AS average_rating
    FROM properties
    LEFT JOIN property_reviews ON properties.id = property_reviews.property_id
  `;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    filterQueries.push(`city LIKE $${queryParams.length}`);
  }

  if (options.owner_id) {
    queryParams.push(options.owner_id);
    filterQueries.push(`owner_id = $${queryParams.length}`);
  }

  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100); // Convert dollars to cents
    filterQueries.push(`cost_per_night >= $${queryParams.length}`);
  }

  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night * 100); // Convert dollars to cents
    filterQueries.push(`cost_per_night <= $${queryParams.length}`);
  }

  // Checks if there is an element inside and if so joins it to a where keyword and joins other queries together using AND
  if (filterQueries.length > 0) {
    queryString += ` WHERE ${filterQueries.join(' AND ')}`;
  }

  queryString += `
    GROUP BY properties.id
  `;

  //Lets use store our minmum rating inside our queryString after GROUP
  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `
    HAVING AVG(property_reviews.rating) >= $${queryParams.length}
    `;
  }

  queryParams.push(limit); // Add limit parameter to queryParams
  queryString += `
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
  `;

  return pool.query(queryString, queryParams)
    .then(res => res.rows)
    .catch(err => {
      console.error(err.message);
    });
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const queryString = `
  INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *;
  `;
  const values = [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms, property.country, property.street, property.city, property.province, property.post_code];

  return pool.query(queryString, values)
    .then(res => {
      return res.rows[0];
    })
    .catch(err => {
      return console.log('query error:', err);
    })
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
